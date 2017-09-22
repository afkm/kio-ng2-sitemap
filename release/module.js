import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { KioNg2i18nModule } from 'kio-ng2-i18n';
import { BackendService, KioCtnModule } from 'kio-ng2-ctn';
export { SitemapChapter } from './classes/sitemap-chapter.class';
import { URLResolver } from './resolver/url-resolver';
import { DATA_RESOLVER } from './injection/DataResolver.token';
import { SITEMAP_CONFIG } from './injection/SitemapConfig.token';
import { SitemapService } from './services/sitemap.service';
import { SitemapChapterService } from './services/sitemap-chapter.service';
export { SITEMAP_CONFIG } from './injection/SitemapConfig.token';
export { SitemapService } from './services/sitemap.service';
export { SitemapChapterService } from './services/sitemap-chapter.service';
/**
 * should be overridden through app module config
 */
export var defaultSitemapConfig = {
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
};
var KioNg2SitemapModule = /** @class */ (function () {
    function KioNg2SitemapModule() {
    }
    KioNg2SitemapModule.forRoot = function (sitemapConfig) {
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
        };
    };
    KioNg2SitemapModule.forChild = function () {
        return {
            ngModule: KioNg2SitemapModule
        };
    };
    KioNg2SitemapModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule, KioCtnModule, KioNg2i18nModule],
                    //declarations: [],
                    providers: [
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
                        SitemapChapterService
                    ],
                    //entryComponents: [],
                    exports: [CommonModule, KioNg2i18nModule]
                },] },
    ];
    /** @nocollapse */
    KioNg2SitemapModule.ctorParameters = function () { return []; };
    return KioNg2SitemapModule;
}());
export { KioNg2SitemapModule };
//# sourceMappingURL=module.js.map