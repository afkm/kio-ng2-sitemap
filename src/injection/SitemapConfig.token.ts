import { Config } from '../interfaces'
import { InjectionToken } from '@angular/core'

export let SITEMAP_CONFIG:InjectionToken<Config> = new InjectionToken<Config>('sitemap_config')
