import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/concatMap';
import { EventEmitter } from '@angular/core';
import { ChapterState } from '../enums/sitemap-chapter-state.enum';
import { LocalizedChapter, Config, Data, DataResolver } from '../interfaces';
import { KioPublicationModel } from 'kio-ng2-data';
export declare class SitemapChapter {
    readonly sitemapConfig: Config;
    readonly chapter: LocalizedChapter;
    protected dataResolver: DataResolver;
    constructor(sitemapConfig: Config, chapter: LocalizedChapter, dataResolver: DataResolver);
    readonly cuid: string;
    readonly locale: string;
    readonly stateChanges: EventEmitter<ChapterState>;
    readonly data: Observable<Data<KioPublicationModel>>;
}
