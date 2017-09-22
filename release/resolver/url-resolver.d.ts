import { Config, ChapterConfig } from '../interfaces';
export declare class URLResolver {
    readonly config: Config;
    static LangFromLocale(locale: string): string;
    constructor(config: Config);
    splitURL(url: string): string[];
    /** returns matching locale for url; if lang is empty or not compatible, the default locale is returned  */
    resolveLocaleFromURL(url: string | string[]): string;
    parseLocaleFromURL(url: string | string[]): string;
    /** returns matching lang for url; if lang is empty or not compatible, the lang for default locale is returned  */
    resolveLangFromURL(url: string | string[]): string;
    resolveSlugFromURL(url: string | string[]): string;
    resolveChapterConfigFromURL(url: string | string[]): ChapterConfig;
}
