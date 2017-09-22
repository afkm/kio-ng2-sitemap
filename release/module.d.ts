import { ModuleWithProviders } from '@angular/core';
export { SitemapChapter } from './classes/sitemap-chapter.class';
import { Config } from './interfaces';
export { SITEMAP_CONFIG } from './injection/SitemapConfig.token';
export { SitemapService } from './services/sitemap.service';
export { SitemapChapterService } from './services/sitemap-chapter.service';
export { Config, LocalizedChapter, ChapterConfig } from './interfaces';
/**
 * should be overridden through app module config
 */
export declare let defaultSitemapConfig: Config;
export declare class KioNg2SitemapModule {
    static forRoot(sitemapConfig: Config): ModuleWithProviders;
    static forChild(): ModuleWithProviders;
}
