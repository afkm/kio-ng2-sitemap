import { Injectable, Inject } from '@angular/core'
import * as path from 'path'
import { SITEMAP_CONFIG } from '../injection/SitemapConfig.token'
import { Config, LocalizedChapter, ChapterConfig, ChapterLocalizer, SlugMap } from '../interfaces'
import * as urlUtil from 'url'
import * as querystring from 'querystring'


@Injectable()
export class URLResolver {

  public static LangFromLocale ( locale:string ):string {
    return locale.substr(0,2)
  }

  constructor (
    @Inject(SITEMAP_CONFIG) readonly config:Config
   ) {

  }

  public isDevURL ( url:string|string[] ):boolean {
    if ( !Array.isArray(url) ) {
      return this.isDevURL(this.splitURL (url))
    }

    return url[0] === 'dev'

  }

  public splitURL ( url:string ):string[] {
    return url.split(path.sep).filter ( p => !!p )
  }

  /** returns matching locale for url; if lang is empty or not compatible, the default locale is returned  */
  public resolveLocaleFromURL ( url:string|string[] ):string {
    if ( !Array.isArray(url) ) {
      return this.resolveLocaleFromURL (this.splitURL(url))
    }

    const [ lang='' ] = url
    const locale = this.config.locales.find ( l => l.substr(0,2) === lang )
    return locale || this.config.locales[0]
  }

  public parseLocaleFromURL ( url:string|string[] ):string {
    if ( !Array.isArray(url) ) {
      return this.parseLocaleFromURL (this.splitURL(url))
    }

    const [ lang='' ] = url
    return this.config.locales.find ( ll => ll.substr(0,2) === lang )
  }

  public parseQueryFromURL ( url:string ) {

    const _url = urlUtil.parse(url)
    return _url.query ? _url.search : ''

  }

  /** returns matching lang for url; if lang is empty or not compatible, the lang for default locale is returned  */
  public resolveLangFromURL ( url:string|string[] ):string {
    return URLResolver.LangFromLocale( this.resolveLocaleFromURL(url) )
  }

  public resolveSlugFromURL ( url:string|string[] ):string {
    if ( !Array.isArray(url) ) {
      return this.resolveSlugFromURL (this.splitURL(url))
    }
    const [ lang='', slug='' ] = url
    const locale = this.resolveLocaleFromURL(url)
    if ( !slug ) {
      return this.config.chapters[0].slug[locale]
    }
    return slug
  }

  public resolveChapterConfigFromURL ( url:string|string[] ):ChapterConfig {
    let slug = this.resolveSlugFromURL ( url )

    // remove possible hash / fragment from slug
    const h = slug.indexOf('#')
    slug = slug.substring(0, h != -1 ? h : slug.length)

    const locale = this.resolveLocaleFromURL ( url )
    return this.config.chapters.find ( chapter => chapter.slug[locale] === slug )
  }

}
