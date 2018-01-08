import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/concatMap'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/mapTo'
import 'rxjs/add/operator/withLatestFrom'
import 'rxjs/add/operator/take'
import 'rxjs/add/operator/startWith'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/shareReplay'
import 'rxjs/add/operator/toArray'
import 'rxjs/add/observable/of'
import 'rxjs/add/observable/empty'
import 'rxjs/add/observable/merge'
import 'rxjs/add/observable/defer'
//import 'rxjs/add/observable/startWith'
import { LocaleService } from 'kio-ng2-i18n'
import { Injectable, Inject, EventEmitter, Optional } from '@angular/core'
import { SITEMAP_CONFIG } from '../injection/SitemapConfig.token'
import { DATA_RESOLVER } from '../injection/DataResolver.token'
import { Data, AbstractData, SlugMap, DataResolver, LocalizedChapter, ChapterConfig, Config } from '../interfaces'
import { SitemapService } from './sitemap.service'
import { SitemapChapter } from '../classes/sitemap-chapter.class'

import { ChapterState } from '../enums/sitemap-chapter-state.enum'
import { KioPublicationModel, KioQueryResult, KioQuery } from 'kio-ng2-data'
import { isChapterConfig, isLocalizedChapter } from '../typechecks'

@Injectable()
export class SitemapChapterService {

  constructor( 
    protected sitemapService:SitemapService,
    @Inject(DATA_RESOLVER) protected dataResolver:DataResolver
    ){

  }

  config=this.sitemapService.config

  expandChapter ( localizedChapter:LocalizedChapter ) {
    return new SitemapChapter(this.sitemapService.config,localizedChapter,this.dataResolver)
  }

  models:Observable<SitemapChapter>=this.sitemapService.chapters.flatMap ( chapters => {
    return chapters.map ( chapter => this.expandChapter(chapter) )
  } ) 

  allModels:Observable<SitemapChapter[]>=this.sitemapService.allChapters.map ( chapters => {
    return chapters.map ( chapter => this.expandChapter(chapter) )
  } ) 

  navigation:Observable<LocalizedChapter>=this.allModels.concatMap ( allModels => {
    return Observable.of(...allModels).concatMap( model => this.mapChapterModelData(model) )
  } )

  public gotoChapter ( chapterItem:SitemapChapter|LocalizedChapter ):Observable<boolean> {
    if ( isLocalizedChapter(chapterItem) ) {
      return this.sitemapService.navigateToChapter(chapterItem)
    } else  {
      return this.gotoChapter ( chapterItem.chapter )
    }
  }

  public chapterForCUID ( cuid:string ):LocalizedChapter {
    return this.sitemapService.findChapterConfig (cuid,true)
  }

  protected mapChapterModelData ( chapter:SitemapChapter ) {
    const chapterConfig = this.sitemapService.config.chapters.find ( c => c.cuid === chapter.cuid )
    return chapter.data.map ( (payload):LocalizedChapter => {      
      return {
        ...<any>chapter,
        cuid: chapter.cuid,
        locale: chapter.locale,
        slug: chapterConfig.slug[chapter.locale],
        title: payload.data.title,
        intro: chapterConfig.intro
      }
    } )
  }

}