import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/concatMap'
import { EventEmitter } from '@angular/core'

import { SITEMAP_CONFIG } from '../injection/SitemapConfig.token'
import { DATA_RESOLVER } from '../injection/DataResolver.token'

import { ChapterState } from '../enums/sitemap-chapter-state.enum'

import { LocalizedChapter, ChapterConfig, Config, Data, DataResolver } from '../interfaces'
import { KioPublicationModel, KioQueryResult, KioQuery } from 'kio-ng2-data'

export class SitemapChapter {

  constructor(
      readonly sitemapConfig: Config,
      readonly chapter: LocalizedChapter,
      protected dataResolver: DataResolver
    ){
    this.cuid = chapter.cuid
    this.locale = chapter.locale
  }

  readonly cuid:string
  readonly locale:string

  readonly stateChanges:EventEmitter<ChapterState>=new EventEmitter()

  readonly data:Observable<Data<KioPublicationModel>>=Observable.concat(
    Observable.defer(()=>{
      this.stateChanges.emit(ChapterState.loading)
      return Observable.empty()
    }),    
    this.dataResolver.load({
      cuid: this.chapter.cuid,
      role: 'pub',
      headers: true,
      cmd: 'get'
    })
    .map ( result => {
      const state = this.sitemapConfig.pagingEnabled ? ChapterState.hidden : ChapterState.shown
      this.stateChanges.emit(state)
      return {
        state,
        data: new KioPublicationModel(result.data)
      }
    } )
  )
}