import { Injectable, Inject } from '@angular/core';
import * as path from 'path';
import { SITEMAP_CONFIG } from '../injection/SitemapConfig.token';
var URLResolver = /** @class */ (function () {
    function URLResolver(config) {
        this.config = config;
    }
    URLResolver.LangFromLocale = function (locale) {
        return locale.substr(0, 2);
    };
    URLResolver.prototype.splitURL = function (url) {
        return url.split(path.sep).filter(function (p) { return !!p; });
    };
    /** returns matching locale for url; if lang is empty or not compatible, the default locale is returned  */
    URLResolver.prototype.resolveLocaleFromURL = function (url) {
        if (!Array.isArray(url)) {
            return this.resolveLocaleFromURL(this.splitURL(url));
        }
        var _a = url[0], lang = _a === void 0 ? '' : _a;
        var locale = this.config.locales.find(function (l) { return l.substr(0, 2) === lang; });
        return locale || this.config.locales[0];
    };
    URLResolver.prototype.parseLocaleFromURL = function (url) {
        if (!Array.isArray(url)) {
            return this.parseLocaleFromURL(this.splitURL(url));
        }
        var _a = url[0], lang = _a === void 0 ? '' : _a;
        return this.config.locales.find(function (ll) { return ll.substr(0, 2) === lang; });
    };
    /** returns matching lang for url; if lang is empty or not compatible, the lang for default locale is returned  */
    URLResolver.prototype.resolveLangFromURL = function (url) {
        return URLResolver.LangFromLocale(this.resolveLocaleFromURL(url));
    };
    URLResolver.prototype.resolveSlugFromURL = function (url) {
        if (!Array.isArray(url)) {
            return this.resolveSlugFromURL(this.splitURL(url));
        }
        var _a = url[0], lang = _a === void 0 ? '' : _a, _b = url[1], slug = _b === void 0 ? '' : _b;
        var locale = this.resolveLocaleFromURL(url);
        if (!slug) {
            return this.config.chapters[0].slug[locale];
        }
        return slug;
    };
    URLResolver.prototype.resolveChapterConfigFromURL = function (url) {
        var slug = this.resolveSlugFromURL(url);
        var locale = this.resolveLocaleFromURL(url);
        return this.config.chapters.find(function (chapter) { return chapter.slug[locale] === slug; });
    };
    URLResolver.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    URLResolver.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Inject, args: [SITEMAP_CONFIG,] },] },
    ]; };
    return URLResolver;
}());
export { URLResolver };
//# sourceMappingURL=url-resolver.js.map