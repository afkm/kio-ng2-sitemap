import { TestBed, fakeAsync, async, inject } from '@angular/core/testing';
import { Config } from '../interfaces';
import { SITEMAP_CONFIG } from '../injection/SitemapConfig.token';
import { URLResolver } from './url-resolver'

let defaultSitemapConfig:Config = {
  pagingEnabled: true,
  locales: ['de_DE', 'en_US'],
  chapters: [
    {
        "slug": {
            "de_DE": "kapitel-1",
            "en_US": "chapter-1"
        },
        "cuid": "cj2vjgacg0002c6m5kudva99n"
    },
    {
        "slug": {
            "de_DE": "kapitel-2",
            "en_US": "chapter-2"
        },
        "cuid": "cj2vjgacg0003c6m594yne0pu"
    }
  ]
}

describe('URLResolver', () => {
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: SITEMAP_CONFIG,
          useValue: defaultSitemapConfig
        },
        URLResolver
      ]
    });
  });

  describe('resolveLocaleFromURL', () => {

    it('de_DE for empty url', inject([URLResolver], (resolver: URLResolver) => {
      const locale = resolver.resolveLocaleFromURL('')
      expect(locale).toEqual('de_DE')
    }));

    it('de_DE for "/de"', inject([URLResolver], (resolver: URLResolver) => {
      const locale = resolver.resolveLocaleFromURL('/de')
      expect(locale).toEqual('de_DE')
    }));

    it('de_DE for "/de/kapitel-1"', inject([URLResolver], (resolver: URLResolver) => {
      const locale = resolver.resolveLocaleFromURL('/de/kapitel-1')
      expect(locale).toEqual('de_DE')
    }));

    it('en_US for "/en"', inject([URLResolver], (resolver: URLResolver) => {
      const locale = resolver.resolveLocaleFromURL('/en')
      expect(locale).toEqual('en_US')
    }));

    it('en_US for "/en/kapitel-1"', inject([URLResolver], (resolver: URLResolver) => {
      const locale = resolver.resolveLocaleFromURL('/en/kapitel-1')
      expect(locale).toEqual('en_US')
    }));


    it('de_DE for "/foo"', inject([URLResolver], (resolver: URLResolver) => {
      const locale = resolver.resolveLocaleFromURL('/foo')
      expect(locale).toEqual('de_DE')
    }));

  })

  describe('resolveLangFromURL', () => {

    it('de for empty url', inject([URLResolver], (resolver: URLResolver) => {
      const locale = resolver.resolveLangFromURL('')
      expect(locale).toEqual('de')
    }));

    it('de for "/de"', inject([URLResolver], (resolver: URLResolver) => {
      const locale = resolver.resolveLangFromURL('/de')
      expect(locale).toEqual('de')
    }));

    it('de for "/de/kapitel-1"', inject([URLResolver], (resolver: URLResolver) => {
      const locale = resolver.resolveLangFromURL('/de/kapitel-1')
      expect(locale).toEqual('de')
    }));

    it('en for "/en"', inject([URLResolver], (resolver: URLResolver) => {
      const locale = resolver.resolveLangFromURL('/en')
      expect(locale).toEqual('en')
    }));

    it('en for "/en/kapitel-1"', inject([URLResolver], (resolver: URLResolver) => {
      const locale = resolver.resolveLangFromURL('/en/kapitel-1')
      expect(locale).toEqual('en')
    }));


    it('de for "/foo"', inject([URLResolver], (resolver: URLResolver) => {
      const locale = resolver.resolveLangFromURL('/foo')
      expect(locale).toEqual('de')
    }));    
  })  

  describe('resolveSlugFromURL', () => {

    it('kapitel-1 for empty url', inject([URLResolver], (resolver: URLResolver) => {
      const slug = resolver.resolveSlugFromURL('')
      expect(slug).toEqual('kapitel-1')
    }));

    it('kapitel-1 for "/de"', inject([URLResolver], (resolver: URLResolver) => {
      const slug = resolver.resolveSlugFromURL('/de')
      expect(slug).toEqual('kapitel-1')
    }));

    it('kapitel-1 for "/de/kapitel-1"', inject([URLResolver], (resolver: URLResolver) => {
      const slug = resolver.resolveSlugFromURL('/de/kapitel-1')
      expect(slug).toEqual('kapitel-1')
    }));

    it('kapitel-2 for "/de/kapitel-2"', inject([URLResolver], (resolver: URLResolver) => {
      const slug = resolver.resolveSlugFromURL('/de/kapitel-2')
      expect(slug).toEqual('kapitel-2')
    }));
  })  

});