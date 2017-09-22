import { ChapterConfig } from './config'

export interface LocalizedChapter {
  slug: string
  cuid: string
  locale: string
  intro?: boolean
  title?: string
}

export interface ChapterLocalizer {
  ( config:ChapterConfig ):LocalizedChapter
}
