export interface SlugMap {
  [key: string]: string
}

export interface ChapterConfig {
  slug: SlugMap
  cuid: string
  intro?: boolean
}

export interface Config {
  /** 
  * true => slugs are used for content navigation
  * false => prefixes on slug keys are used (de, en, ...)
  */
  pagingEnabled?: boolean

  /**
   * only valid for pagingEnabled==true
   * true => force entry in first chapter
   * false => allow deep links (default)
   */
  forceFirstPageEntry?: boolean

  /**
   * supported locales
   */
  locales: string[]

  /**
   * chapter configurations
   */
  chapters: ChapterConfig[]

}