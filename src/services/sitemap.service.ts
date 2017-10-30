import { Observable } from 'rxjs/Observable'
import { Subscription } from 'rxjs/Subscription'
import 'rxjs/add/operator/concatMap'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/mapTo'
import 'rxjs/add/operator/withLatestFrom'
import 'rxjs/add/operator/distinctUntilChange'
import 'rxjs/add/operator/distinct'
import 'rxjs/add/operator/take'
import 'rxjs/add/operator/startWith'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/shareReplay'
import 'rxjs/add/operator/toArray'
import 'rxjs/add/observable/of'
import 'rxjs/add/observable/fromPromise'
import 'rxjs/add/observable/empty'
import 'rxjs/add/observable/merge'
import 'rxjs/add/observable/defer'
//import 'rxjs/add/observable/startWith'
import { LocaleService } from 'kio-ng2-i18n'
import { isDevMode, Injectable, Inject, EventEmitter, Optional } from '@angular/core'
import { Router, NavigationEnd } from '@angular/router'
import { SITEMAP_CONFIG } from '../injection/SitemapConfig.token'
import { Config, LocalizedChapter, ChapterConfig, ChapterLocalizer, SlugMap } from '../interfaces'
import { URLResolver } from '../resolver/url-resolver'
import * as urlUtil from 'url'

@Injectable()
export class SitemapService {

  /**
   * returns key of target which's property equals slug
   *
   * @param      target  any object
   * @param      slug    The slug
   */
  public static keyWithSlug ( target:{[key:string]: string}, slug:string ) {
    return Object.keys(target).find ( key => target[key] === slug )
  }

  /**
   * creates a function to localize a ChapterConfig with defined locale
   * @param      locale   The locale
   */
  public static chapterLocalizerFactory ( locale:string ) {
    return ( chapter:ChapterConfig ):LocalizedChapter => {
      return {
        locale,
        ...chapter,
        slug: chapter.slug[locale]
      }
    }
  }

  constructor(
      @Inject(SITEMAP_CONFIG) readonly config:Config,
      @Optional() @Inject(LocaleService) protected localeService:LocaleService,
      @Inject(Router) protected router:Router,
      @Inject(URLResolver) protected urlResolver:URLResolver
    )
  {

  }

  /** observable of url emitted after the router emitted an NavigationEnd event */
  currentUrl=this.router.events.filter ( event => (event instanceof NavigationEnd ) )
    .map ( (event:NavigationEnd) => event.url )
    .distinctUntilChanged()
    /*.map ( url => {
      console.log('current url', url)
      return url
    } )*/

  locale=this.currentUrl.map ( url => this.urlResolver.resolveLocaleFromURL(url) ).distinctUntilChanged()
  lang=this.currentUrl.map ( url => this.urlResolver.resolveLangFromURL(url) ).distinctUntilChanged()

  private dbg_locale = this.locale.subscribe ( ll => {
    //console.log('dbg_locale', ll)
    this.localeService.updateLocale (ll)
  } )
  
  chapterConfig=this.currentUrl.map ( url => this.urlResolver.resolveChapterConfigFromURL(url) )

  /** observable of current sitemap chapter, emits on initialization and on locale changes */
  sitemapChapter=this.chapterConfig.filter(chapter => chapter !== undefined)
  .withLatestFrom ( this.locale, ( chapterConfig, locale ) => {
    return SitemapService.chapterLocalizerFactory (locale)(chapterConfig)
  } )
  .distinctUntilChanged ( ( prev:LocalizedChapter, curr:LocalizedChapter) => prev.slug === curr.slug )
  /*.flatMap ( sitemapChapter => {
    return this.updateLocale ( sitemapChapter.locale ).mapTo(sitemapChapter)
  } )*/

  /** observable of current localized sitemap chapters, emits on initialization and on locale changes */
  chapters:Observable<LocalizedChapter[]>=this.sitemapChapter
  .concatMap ( (sitemapChapter):Observable<LocalizedChapter[]> => {
    const chapterLocalizer = SitemapService.chapterLocalizerFactory(sitemapChapter.locale)
    if ( this.config.pagingEnabled === true ) {
      return Observable.of([sitemapChapter])
    } else {
      return Observable.of(...this.config.chapters).map ( chapterLocalizer ).toArray()
    }
  } )

  /** observable of all localized sitemap chapters, emits on initialization and on locale changes */
  allChapters:Observable<LocalizedChapter[]>=this.sitemapChapter
  .concatMap ( (sitemapChapter):Observable<LocalizedChapter[]> => {
    const chapterLocalizer = SitemapService.chapterLocalizerFactory(sitemapChapter.locale)
    return Observable.of(...this.config.chapters).map ( chapterLocalizer ).toArray()
  } )


  /** @type {SitemapChapter} current sitemap chapter */
  protected currentChapter:LocalizedChapter

  /** subscription to update sitemapChapter on emission of sitemapChapter */
  private currentChapterSubscription=this.sitemapChapter.subscribe ( (chapter:LocalizedChapter) => {
    this.currentChapter = chapter
  } )

  /** forwarding */

  private forwardUrl=this.currentUrl.subscribe ( (url:string) => {

    const urlObj = urlUtil.parse ( url )

    if ( this.urlResolver.isDevURL(urlObj.pathname) ) {
      if ( !isDevMode() ) {
        this.router.navigateByUrl('/').then ( () => {
          console.warn('dev routes disabled in production')
        } )
      } else {
        return
      }
    }

    const query = this.urlResolver.parseQueryFromURL(url)
    let locale = this.urlResolver.parseLocaleFromURL(urlObj.pathname)
    if ( !locale ) {
      locale = this.localeService.currentLocale
    }
    let chapterConfig = this.urlResolver.resolveChapterConfigFromURL ( urlObj.pathname )
    const localizedChapter = SitemapService.chapterLocalizerFactory ( locale ) ( chapterConfig )
    const defaultURL = this.renderURL ( localizedChapter.locale, localizedChapter.slug ) + query

    if ( urlObj.path.indexOf(defaultURL) !== 0 ) {
      this.router.navigateByUrl(defaultURL).then ( (success:boolean) => {
        if ( isDevMode() ) {
          console.log('did %sforward to %s', success ? '' : 'not ', defaultURL)
        }
      } )
    }
  } )

  public findChapterConfig ( slug:string, localized:true ):LocalizedChapter
  public findChapterConfig ( cuid:string, localized?:true ):ChapterConfig|LocalizedChapter {
    const locale = this.localeService.currentLocale
    const chapterConfig = this.config.chapters.find ( chapter => chapter.cuid === cuid || chapter.slug[locale] === cuid )
    if ( chapterConfig && localized === true ) {
      return SitemapService.chapterLocalizerFactory ( locale ) ( chapterConfig )
    } else {
      return chapterConfig
    }
  }
  
  /** changes app locale, updates the current navigation status and changes url */
  public switchToLocale ( nextLocale:string ):Observable<string> {
    const chapterLocalizer = SitemapService.chapterLocalizerFactory ( nextLocale )
    const chapterSource = this.getCurrentChapter()
    return Observable.of(nextLocale)
    .withLatestFrom(chapterSource,(locale,chapter)=>{
      const chapterConfig = this.getChapterConfigByCuid(chapter.cuid)
      return chapterLocalizer ( chapterConfig )
    })
    .filter ( chapter => !!chapter )
    .flatMap ( nextChapter => {
      return this.navigateToChapter ( nextChapter )
          .map ( (success:boolean) => {
            return success ? nextChapter.slug : undefined
          } )
    } )
  }

  public navigateToChapter ( chapter:LocalizedChapter ):Observable<boolean> {
    const url = this.renderURL ( chapter.locale, chapter.slug )
    return Observable.fromPromise ( this.router.navigateByUrl ( url ) )
  }

  public renderURL ( locale:string, slug?:string ):string {
    if ( !slug ) {
      return this.renderURL ( locale, this.config.chapters[0].slug[locale] )
    }
    if ( this.config.pagingEnabled ) {
      return `/${locale.substr(0,2)}/${slug}`
    } else {
      return `/${locale.substr(0,2)}`
    }
  }


  /**
   * @brief      returns sitemap chapter matching url
   *
   * @param      url   The url path
   *
   * @return     sitemap chapter or undefined
   */
  public sitemapChapterByUrl ( url:string ):LocalizedChapter {
    const chapterConfigs:ChapterConfig[] = this.config.chapters.slice()
    if ( url.substr(0,1) === '/' ) {
      return this.sitemapChapterByUrl ( url.slice(1) )
    } else {
      return chapterConfigs.map ( chapterConfig => {
        const locale = SitemapService.keyWithSlug(chapterConfig.slug, url )
        if ( !locale ) {
          return undefined
        } else {
          return {
            locale ,
            slug: url,
            cuid: chapterConfig.cuid
          }
        }
      } )
      .find ( chapter => chapter && chapter.slug === url )
    }
  }  

  /** returns observable of latest sitemap chapter */
  protected getCurrentChapter():Observable<LocalizedChapter> {
    if ( this.currentChapter ) {
      return Observable.of(this.currentChapter)
    } else {
      return this.sitemapChapter.take(1)
    }
  }

  /** changes current locale and returns an observable of the new observable */
  private updateLocale ( nextLocale:string ):Observable<string> {
    if ( this.localeService && this.localeService.currentLocale !== nextLocale ) {
      return Observable.merge ( this.localeService.changes.take(1), Observable.defer(()=>{
        this.localeService.updateLocale(nextLocale)
        return Observable.empty()
      }) ).take(1).mapTo(nextLocale)
    } else {
      return Observable.of(nextLocale)
    }
  }

  private getChapterConfigByCuid ( cuid:string ):ChapterConfig {
    return this.config.chapters.find ( chapter => chapter.cuid === cuid )
  }
  
}