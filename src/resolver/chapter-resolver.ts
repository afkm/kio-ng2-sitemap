import { Observable } from 'rxjs/Observable'
import { Injectable, Inject } from '@angular/core'
import * as path from 'path'
import { SITEMAP_CONFIG } from '../injection/SitemapConfig.token'
import { Config, LocalizedChapter, ChapterConfig, ChapterLocalizer, Chapter, SlugMap } from '../interfaces'
import { LocaleService } from 'kio-ng2-i18n'
import { TranslateService } from '@ngx-translate/core'


@Injectable()
export class ChapterResolver {


  constructor ( 
    @Inject(SITEMAP_CONFIG) protected config:Config,
    protected localeService:LocaleService,
    protected translateService:TranslateService
  ) {

  }

  chapters:Observable<Chapter[]>=Observable.of(...this.config.chapters).map ( (chapterConfig:ChapterConfig) => {
    return {
      cuid: chapterConfig.cuid
    }
  } ).toArray()


  localizedChapters:Observable<LocalizedChapter[]>=this.localeService.changes.startWith(this.localeService.currentLocale)
    .flatMap ( (locale:string) => {
      return Observable.of(...this.config.chapters).concatMap ( (chapterConfig:ChapterConfig, index:number) => this.translateChapter(chapterConfig,index) ).toArray()
    } ) 

  protected translateChapter ( config:ChapterConfig, index:number ):Observable<LocalizedChapter> {

    return this.translateService.get(`Chapter ${index}`).map ( (chapterTitle:string) => {

      return {
        ...config,
        cuid: config.cuid,
        slug: config.slug[this.localeService.currentLocale],
        title: chapterTitle,
        intro: config.intro,
        locale: this.localeService.currentLocale
      }

    } )

  }

}