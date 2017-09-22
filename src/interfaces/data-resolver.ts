import { KioQuery, KioQueryResult } from 'kio-ng2-data'
import { Observable } from 'rxjs/Observable'
import { ChapterState } from '../enums/sitemap-chapter-state.enum'

export interface AbstractData {
  cuid:string
  locale:string
  title?:string
}

export interface Data <T extends AbstractData> {
  state: ChapterState
  data: T
}

export interface DataResolver {
 load ( query:KioQuery, ttl?:number ):Observable<KioQueryResult>
}