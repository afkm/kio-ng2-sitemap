/* tslint:disable:no-unused-variable */

import { RouterTestingModule } from '@angular/router/testing'
import { TestBed, fakeAsync, async, inject } from '@angular/core/testing';
import { ChapterState } from '../enums/sitemap-chapter-state.enum';
import { Config } from '../interfaces';
import { SITEMAP_CONFIG } from '../injection/SitemapConfig.token';
import { SitemapService } from './sitemap.service';

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

describe('SitemapService', () => {
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        {  
          provide: SITEMAP_CONFIG,
          useValue: defaultSitemapConfig
        },
        SitemapService
      ]
    });
  });

  it('should have config', inject([SitemapService], (service: SitemapService) => {
    expect(service.config).toBeTruthy()
  }));


});
