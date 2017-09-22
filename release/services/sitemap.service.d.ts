import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
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
import { LocaleService } from 'kio-ng2-i18n';
import { Router } from '@angular/router';
import { Config, LocalizedChapter, ChapterConfig } from '../interfaces';
import { URLResolver } from '../resolver/url-resolver';
export declare class SitemapService {
    readonly config: Config;
    protected localeService: LocaleService;
    protected router: Router;
    protected urlResolver: URLResolver;
    /**
     * returns key of target which's property equals slug
     *
     * @param      target  any object
     * @param      slug    The slug
     */
    static keyWithSlug(target: {
        [key: string]: string;
    }, slug: string): string;
    /**
     * creates a function to localize a ChapterConfig with defined locale
     * @param      locale   The locale
     */
    static chapterLocalizerFactory(locale: string): (chapter: ChapterConfig) => LocalizedChapter;
    constructor(config: Config, localeService: LocaleService, router: Router, urlResolver: URLResolver);
    /** observable of url emitted after the router emitted an NavigationEnd event */
    currentUrl: Observable<string>;
    locale: Observable<string>;
    lang: Observable<string>;
    chapterConfig: Observable<ChapterConfig>;
    /** observable of current sitemap chapter, emits on initialization and on locale changes */
    sitemapChapter: Observable<LocalizedChapter>;
    /** observable of current localized sitemap chapters, emits on initialization and on locale changes */
    chapters: Observable<LocalizedChapter[]>;
    /** observable of all localized sitemap chapters, emits on initialization and on locale changes */
    allChapters: Observable<LocalizedChapter[]>;
    /** @type {SitemapChapter} current sitemap chapter */
    protected currentChapter: LocalizedChapter;
    /** subscription to update sitemapChapter on emission of sitemapChapter */
    protected currentChapterSubscription: Subscription;
    /** forwarding */
    protected forwardUrl: Subscription;
    findChapterConfig(slug: string, localized: true): LocalizedChapter;
    /** changes app locale, updates the current navigation status and changes url */
    switchToLocale(nextLocale: string): Observable<string>;
    navigateToChapter(chapter: LocalizedChapter): Observable<boolean>;
    renderURL(locale: string, slug?: string): string;
    /**
     * @brief      returns sitemap chapter matching url
     *
     * @param      url   The url path
     *
     * @return     sitemap chapter or undefined
     */
    sitemapChapterByUrl(url: string): LocalizedChapter;
    /** returns observable of latest sitemap chapter */
    protected getCurrentChapter(): Observable<LocalizedChapter>;
    /** changes current locale and returns an observable of the new observable */
    private updateLocale(nextLocale);
    private getChapterConfigByCuid(cuid);
}
