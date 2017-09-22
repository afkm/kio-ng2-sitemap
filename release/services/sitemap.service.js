var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/distinct';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/shareReplay';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/defer';
//import 'rxjs/add/observable/startWith'
import { LocaleService } from 'kio-ng2-i18n';
import { isDevMode, Injectable, Inject, Optional } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { SITEMAP_CONFIG } from '../injection/SitemapConfig.token';
import { URLResolver } from '../resolver/url-resolver';
var SitemapService = /** @class */ (function () {
    function SitemapService(config, localeService, router, urlResolver) {
        var _this = this;
        this.config = config;
        this.localeService = localeService;
        this.router = router;
        this.urlResolver = urlResolver;
        /** observable of url emitted after the router emitted an NavigationEnd event */
        this.currentUrl = this.router.events.filter(function (event) { return (event instanceof NavigationEnd); })
            .map(function (event) { return event.url; })
            .distinctUntilChanged();
        /*.map ( url => {
          console.log('current url', url)
          return url
        } )*/
        this.locale = this.currentUrl.map(function (url) { return _this.urlResolver.resolveLocaleFromURL(url); }).distinctUntilChanged();
        this.lang = this.currentUrl.map(function (url) { return _this.urlResolver.resolveLangFromURL(url); }).distinctUntilChanged();
        this.chapterConfig = this.currentUrl.map(function (url) { return _this.urlResolver.resolveChapterConfigFromURL(url); });
        /** observable of current sitemap chapter, emits on initialization and on locale changes */
        this.sitemapChapter = this.chapterConfig.filter(function (chapter) { return chapter !== undefined; })
            .withLatestFrom(this.locale, function (chapterConfig, locale) {
            return SitemapService.chapterLocalizerFactory(locale)(chapterConfig);
        })
            .flatMap(function (sitemapChapter) {
            return _this.updateLocale(sitemapChapter.locale).mapTo(sitemapChapter);
        });
        /** observable of current localized sitemap chapters, emits on initialization and on locale changes */
        this.chapters = this.sitemapChapter
            .concatMap(function (sitemapChapter) {
            var chapterLocalizer = SitemapService.chapterLocalizerFactory(sitemapChapter.locale);
            if (_this.config.pagingEnabled === true) {
                return Observable.of([sitemapChapter]);
            }
            else {
                return Observable.of.apply(Observable, _this.config.chapters).map(chapterLocalizer).toArray();
            }
        });
        /** observable of all localized sitemap chapters, emits on initialization and on locale changes */
        this.allChapters = this.sitemapChapter
            .concatMap(function (sitemapChapter) {
            var chapterLocalizer = SitemapService.chapterLocalizerFactory(sitemapChapter.locale);
            return Observable.of.apply(Observable, _this.config.chapters).map(chapterLocalizer).toArray();
        });
        /** subscription to update sitemapChapter on emission of sitemapChapter */
        this.currentChapterSubscription = this.sitemapChapter.subscribe(function (chapter) {
            _this.currentChapter = chapter;
        });
        /** forwarding */
        this.forwardUrl = this.currentUrl.subscribe(function (url) {
            if (url.substr(1).startsWith('dev')) {
                return;
            }
            var locale = _this.urlResolver.parseLocaleFromURL(url);
            if (!locale) {
                locale = _this.localeService.currentLocale;
            }
            var chapterConfig = _this.urlResolver.resolveChapterConfigFromURL(url);
            var localizedChapter = SitemapService.chapterLocalizerFactory(locale)(chapterConfig);
            var defaultURL = _this.renderURL(localizedChapter.locale, localizedChapter.slug);
            if (url !== defaultURL) {
                _this.router.navigateByUrl(defaultURL).then(function (success) {
                    if (isDevMode()) {
                        console.log('did %sforward to %s', success ? '' : 'not ', defaultURL);
                    }
                });
            }
        });
    }
    /**
     * returns key of target which's property equals slug
     *
     * @param      target  any object
     * @param      slug    The slug
     */
    SitemapService.keyWithSlug = function (target, slug) {
        return Object.keys(target).find(function (key) { return target[key] === slug; });
    };
    /**
     * creates a function to localize a ChapterConfig with defined locale
     * @param      locale   The locale
     */
    SitemapService.chapterLocalizerFactory = function (locale) {
        return function (chapter) {
            return __assign({ locale: locale }, chapter, { slug: chapter.slug[locale] });
        };
    };
    SitemapService.prototype.findChapterConfig = function (cuid, localized) {
        var locale = this.localeService.currentLocale;
        var chapterConfig = this.config.chapters.find(function (chapter) { return chapter.cuid === cuid || chapter.slug[locale] === cuid; });
        if (chapterConfig && localized === true) {
            return SitemapService.chapterLocalizerFactory(locale)(chapterConfig);
        }
        else {
            return chapterConfig;
        }
    };
    /** changes app locale, updates the current navigation status and changes url */
    SitemapService.prototype.switchToLocale = function (nextLocale) {
        var _this = this;
        var chapterLocalizer = SitemapService.chapterLocalizerFactory(nextLocale);
        var chapterSource = this.getCurrentChapter();
        return Observable.of(nextLocale)
            .withLatestFrom(chapterSource, function (locale, chapter) {
            var chapterConfig = _this.getChapterConfigByCuid(chapter.cuid);
            return chapterLocalizer(chapterConfig);
        })
            .filter(function (chapter) { return !!chapter; })
            .flatMap(function (nextChapter) {
            return _this.navigateToChapter(nextChapter)
                .map(function (success) {
                return success ? nextChapter.slug : undefined;
            });
        });
    };
    SitemapService.prototype.navigateToChapter = function (chapter) {
        var url = this.renderURL(chapter.locale, chapter.slug);
        return Observable.fromPromise(this.router.navigateByUrl(url));
    };
    SitemapService.prototype.renderURL = function (locale, slug) {
        if (!slug) {
            return this.renderURL(locale, this.config.chapters[0].slug[locale]);
        }
        if (this.config.pagingEnabled) {
            return "/" + locale.substr(0, 2) + "/" + slug;
        }
        else {
            return "/" + locale.substr(0, 2);
        }
    };
    /**
     * @brief      returns sitemap chapter matching url
     *
     * @param      url   The url path
     *
     * @return     sitemap chapter or undefined
     */
    SitemapService.prototype.sitemapChapterByUrl = function (url) {
        var chapterConfigs = this.config.chapters.slice();
        if (url.substr(0, 1) === '/') {
            return this.sitemapChapterByUrl(url.slice(1));
        }
        else {
            return chapterConfigs.map(function (chapterConfig) {
                var locale = SitemapService.keyWithSlug(chapterConfig.slug, url);
                if (!locale) {
                    return undefined;
                }
                else {
                    return {
                        locale: locale,
                        slug: url,
                        cuid: chapterConfig.cuid
                    };
                }
            })
                .find(function (chapter) { return chapter && chapter.slug === url; });
        }
    };
    /** returns observable of latest sitemap chapter */
    SitemapService.prototype.getCurrentChapter = function () {
        if (this.currentChapter) {
            return Observable.of(this.currentChapter);
        }
        else {
            return this.sitemapChapter.take(1);
        }
    };
    /** changes current locale and returns an observable of the new observable */
    SitemapService.prototype.updateLocale = function (nextLocale) {
        var _this = this;
        if (this.localeService && this.localeService.currentLocale !== nextLocale) {
            return Observable.merge(this.localeService.changes.take(1), Observable.defer(function () {
                _this.localeService.updateLocale(nextLocale);
                return Observable.empty();
            })).take(1).mapTo(nextLocale);
        }
        else {
            return Observable.of(nextLocale);
        }
    };
    SitemapService.prototype.getChapterConfigByCuid = function (cuid) {
        return this.config.chapters.find(function (chapter) { return chapter.cuid === cuid; });
    };
    SitemapService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    SitemapService.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Inject, args: [SITEMAP_CONFIG,] },] },
        { type: LocaleService, decorators: [{ type: Optional },] },
        { type: Router, },
        { type: URLResolver, },
    ]; };
    return SitemapService;
}());
export { SitemapService };
//# sourceMappingURL=sitemap.service.js.map