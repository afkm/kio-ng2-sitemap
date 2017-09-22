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
import { DataResolver, LocalizedChapter, Config } from '../interfaces';
import { SitemapService } from './sitemap.service';
import { SitemapChapter } from '../classes/sitemap-chapter.class';
export declare class SitemapChapterService {
    protected sitemapService: SitemapService;
    protected dataResolver: DataResolver;
    constructor(sitemapService: SitemapService, dataResolver: DataResolver);
    config: Config;
    models: Observable<SitemapChapter>;
    allModels: Observable<SitemapChapter[]>;
    navigation: Observable<LocalizedChapter>;
    gotoChapter(chapterItem: SitemapChapter | LocalizedChapter): Observable<boolean>;
    chapterForCUID(cuid: string): LocalizedChapter;
    protected mapChapterModelData(chapter: SitemapChapter): Observable<LocalizedChapter>;
}
