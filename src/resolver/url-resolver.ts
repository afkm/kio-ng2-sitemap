import { Injectable, Inject } from '@angular/core'
import * as path from 'path'
import { SITEMAP_CONFIG } from '../injection/SitemapConfig.token'
import { Config, LocalizedChapter, ChapterConfig, ChapterLocalizer, SlugMap } from '../interfaces'

@Injectable()
export class URLResolver {

  public static LangFromLocale ( locale:string ):string {
    return locale.substr(0,2)
  }

  constructor ( 
    @Inject(SITEMAP_CONFIG) readonly config:Config
   ) {

  }

  public splitURL ( url:string ):string[] {
    return url.split(path.sep).filter ( p => !!p )
  }

  /** returns matching locale for url; if lang is empty or not compatible, the default locale is returned  */
  public resolveLocaleFromURL ( url:string|string[] ):string {
    if ( !Array.isArray(url) ) {
      return this.resolveLocaleFromURL (this.splitURL(url))
    } 

    const [ lang='' ] = url
    const locale = this.config.locales.find ( l => l.substr(0,2) === lang )
    return locale || this.config.locales[0]
  }
  
  public parseLocaleFromURL ( url:string|string[] ):string {
    if ( !Array.isArray(url) ) {
      return this.parseLocaleFromURL (this.splitURL(url))
    }

    const [ lang='' ] = url
    return this.config.locales.find ( ll => ll.substr(0,2) === lang )
  }
  
  /** returns matching lang for url; if lang is empty or not compatible, the lang for default locale is returned  */
  public resolveLangFromURL ( url:string|string[] ):string {
    return URLResolver.LangFromLocale( this.resolveLocaleFromURL(url) )
  }
  
  public resolveSlugFromURL ( url:string|string[] ):string { 
    if ( !Array.isArray(url) ) {
      return this.resolveSlugFromURL (this.splitURL(url))
    } 
    const [ lang='', slug='' ] = url
    const locale = this.resolveLocaleFromURL(url)
    if ( !slug ) {
      return this.config.chapters[0].slug[locale]
    }
    return slug
  }

  public resolveChapterConfigFromURL ( url:string|string[] ):ChapterConfig {
    const slug = this.resolveSlugFromURL ( url )
    const locale = this.resolveLocaleFromURL ( url )
    return this.config.chapters.find ( chapter => chapter.slug[locale] === slug )
  }

}