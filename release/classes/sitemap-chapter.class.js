import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/concatMap';
import { EventEmitter } from '@angular/core';
import { ChapterState } from '../enums/sitemap-chapter-state.enum';
import { KioPublicationModel } from 'kio-ng2-data';
var SitemapChapter = /** @class */ (function () {
    function SitemapChapter(sitemapConfig, chapter, dataResolver) {
        var _this = this;
        this.sitemapConfig = sitemapConfig;
        this.chapter = chapter;
        this.dataResolver = dataResolver;
        this.stateChanges = new EventEmitter();
        this.data = Observable.concat(Observable.defer(function () {
            _this.stateChanges.emit(ChapterState.loading);
            return Observable.empty();
        }), this.dataResolver.load({
            cuid: this.chapter.cuid,
            role: 'pub',
            headers: true,
            cmd: 'get'
        })
            .map(function (result) {
            var state = _this.sitemapConfig.pagingEnabled ? ChapterState.hidden : ChapterState.shown;
            _this.stateChanges.emit(state);
            return {
                state: state,
                data: new KioPublicationModel(result.data)
            };
        }));
        this.cuid = chapter.cuid;
        this.locale = chapter.locale;
    }
    return SitemapChapter;
}());
export { SitemapChapter };
//# sourceMappingURL=sitemap-chapter.class.js.map