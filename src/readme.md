# Sitemap Module

### Dependencies

- KioNg2i18nModule ( optional )

	when provided, the sitemap service updates the locale in Kio's i18n module according to the sitemap config slug matching the route


## Configuration

### [SitemapConfig](./interfaces/SitemapConfig.ts)

```typescript
const AppSitemapConfig:SitemapConfig = {
  /** 
   * true => slugs are used for content navigation
   * false => prefixes on slug keys are used (de, en, ...)
   */
  pagingEnabled: false,

  /**
   * supported locales
   */   
  locales: ['de_DE','en_US'],
  
  /** 
   * chapter configuration
   */
  chapters: [
    {
      /** 
       * mapping locale to chapter slug
       */
      slug: {
          de_DE: 'kapitel-1',
          en_US: 'chapter-1'
      },
      /** publication cuid of content */
      cuid: 'cj2vjgacg0002c6m5kudva99n'
    }
   ]
}

/** add to app module */

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    // KioNg2i18nModule, <- optional
    KioNg2SitemapModule.forRoot (AppSitemapConfig)
  ]
})
export class AppModule {}    
```