import { Observable } from 'rxjs/Observable'
import { CommonModule } from '@angular/common'
import { NgModule, ModuleWithProviders, Provider } from '@angular/core'
import { KioNg2i18nModule } from 'kio-ng2-i18n'
import { BackendService, KioCtnModule } from 'kio-ng2-ctn'
import { ScrollService } from 'kio-ng2-scrolling'

import { SitemapChapter } from './classes/sitemap-chapter.class'
export { SitemapChapter } from './classes/sitemap-chapter.class'

import { URLResolver } from './resolver/url-resolver'

import { DATA_RESOLVER } from './injection/DataResolver.token'
import { SITEMAP_CONFIG } from './injection/SitemapConfig.token'
import { Config, LocalizedChapter, ChapterConfig } from './interfaces'
import { SitemapService } from './services/sitemap.service'
import { SitemapChapterService } from './services/sitemap-chapter.service'
import { ChapterResolver } from './resolver/chapter-resolver'

export { SITEMAP_CONFIG } from './injection/SitemapConfig.token'
export { SitemapService } from './services/sitemap.service'
export { SitemapChapterService } from './services/sitemap-chapter.service'
export { Config, LocalizedChapter, ChapterConfig } from './interfaces'
export { ChapterResolver } from './resolver/chapter-resolver'


/**
 * should be overridden through app module config
 */
export let defaultSitemapConfig:Config = {
  pagingEnabled: true,
  locales: ['de_DE', 'en_US'],
  chapters: [
    {
        "slug": {
            "de_DE": "kapitel-1",
            "en_US": "chapter-1"
        },
        "cuid": "cj2vjgacg0002c6m5kudva99n"
    },
    {
        "slug": {
            "de_DE": "kapitel-2",
            "en_US": "chapter-2"
        },
        "cuid": "cj2vjgacg0003c6m594yne0pu"
    }
  ]
}

@NgModule({
  imports: [CommonModule,KioCtnModule,KioNg2i18nModule],
  //declarations: [],
  providers: [ 
    ScrollService,
    URLResolver,
    {
      provide: SITEMAP_CONFIG,
      useValue: defaultSitemapConfig
    },
    {
      provide: DATA_RESOLVER,
      useClass: BackendService
    },
    SitemapService,
    SitemapChapterService,
    ChapterResolver
  ],
  //entryComponents: [],
  exports: [CommonModule,KioNg2i18nModule]
})
export class KioNg2SitemapModule {
    public static forRoot ( sitemapConfig:Config ):ModuleWithProviders {
        return {
            ngModule: KioNg2SitemapModule,
            providers: [
                {
                    provide: SITEMAP_CONFIG,
                    useValue: sitemapConfig
                },
                {
                    provide: DATA_RESOLVER,
                    useClass: BackendService
                }
            ]
        }
    }

    public static forChild ( ):ModuleWithProviders {
      return {
        ngModule: KioNg2SitemapModule
      }
    }
}
