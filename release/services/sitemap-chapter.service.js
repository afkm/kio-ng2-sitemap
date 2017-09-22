import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/shareReplay';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/defer';
import { Injectable, Inject } from '@angular/core';
import { DATA_RESOLVER } from '../injection/DataResolver.token';
import { SitemapService } from './sitemap.service';
import { SitemapChapter } from '../classes/sitemap-chapter.class';
import { isLocalizedChapter } from '../typechecks';
var SitemapChapterService = /** @class */ (function () {
    function SitemapChapterService(sitemapService, dataResolver) {
        var _this = this;
        this.sitemapService = sitemapService;
        this.dataResolver = dataResolver;
        this.config = this.sitemapService.config;
        this.models = this.sitemapService.chapters.flatMap(function (chapters) {
            return chapters.map(function (chapter) { return new SitemapChapter(_this.sitemapService.config, chapter, _this.dataResolver); });
        });
        this.allModels = this.sitemapService.allChapters.map(function (chapters) {
            return chapters.map(function (chapter) { return new SitemapChapter(_this.sitemapService.config, chapter, _this.dataResolver); });
        });
        this.navigation = this.allModels.concatMap(function (allModels) {
            return Observable.of.apply(Observable, allModels).concatMap(function (model) { return _this.mapChapterModelData(model); });
        });
    }
    SitemapChapterService.prototype.gotoChapter = function (chapterItem) {
        if (isLocalizedChapter(chapterItem)) {
            return this.sitemapService.navigateToChapter(chapterItem);
        }
        else {
            return this.gotoChapter(chapterItem.chapter);
        }
    };
    SitemapChapterService.prototype.chapterForCUID = function (cuid) {
        return this.sitemapService.findChapterConfig(cuid, true);
    };
    SitemapChapterService.prototype.mapChapterModelData = function (chapter) {
        var chapterConfig = this.sitemapService.config.chapters.find(function (c) { return c.cuid === chapter.cuid; });
        return chapter.data.map(function (payload) {
            return {
                cuid: chapter.cuid,
                locale: chapter.locale,
                slug: chapterConfig.slug[chapter.locale],
                title: payload.data.title,
                intro: chapterConfig.intro
            };
        });
    };
    SitemapChapterService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    SitemapChapterService.ctorParameters = function () { return [
        { type: SitemapService, },
        { type: undefined, decorators: [{ type: Inject, args: [DATA_RESOLVER,] },] },
    ]; };
    return SitemapChapterService;
}());
export { SitemapChapterService };
//# sourceMappingURL=sitemap-chapter.service.js.map