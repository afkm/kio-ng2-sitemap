import { DataResolver } from '../interfaces'
import { InjectionToken } from '@angular/core'

export let DATA_RESOLVER:InjectionToken<DataResolver> = new InjectionToken<DataResolver>('data_resolver')
