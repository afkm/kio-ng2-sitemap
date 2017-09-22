import { ChapterConfig, SlugMap, LocalizedChapter } from './interfaces'


export function isSlugMap ( other:any ):other is SlugMap {
  return ( 'object' === typeof other && Object.keys(other).every( k => 'string' === typeof k ) )
}

export function isChapterConfig ( other:any ):other is ChapterConfig {
  return (
      'cuid' in other
      &&
      'slug' in other
      && 
      isSlugMap(other.slug)
    )
}

export function isLocalizedChapter ( other:any ):other is LocalizedChapter {
  return (
      'cuid' in other
      &&
      ('slug' in other && 'string' === typeof other.slug)
      && 
      'locale' in other
    )
}
