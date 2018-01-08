import { ChapterConfig } from './config'
import { Chapter } from './chapter'

export interface LocalizedChapter extends Chapter {
  slug: string
  locale: string
  intro?: boolean
  title?: string
  hideInNavigation?: boolean
}

export interface ChapterLocalizer {
  ( config:ChapterConfig ):LocalizedChapter
}
