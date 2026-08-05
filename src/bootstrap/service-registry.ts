import { MapService } from '@/services/map.service'
import type { App } from 'vue'
import type { Router } from 'vue-router'
import { PocketBaseService } from '@/services/pocket-base.service'
import { LexiconService } from '@/services/lexicon.service'
import { AudioService } from '@/services/audio.service'

export function createAppServices(_router: Router) {
  const mapService = new MapService()
  const pocketBaseService = new PocketBaseService()
  const lexiconService = new LexiconService(pocketBaseService)
  const audioService = new AudioService(pocketBaseService)

  return {
    pocketBaseService,
    mapService,
    lexiconService,
    audioService,
  }
}

export type AppServices = ReturnType<typeof createAppServices>

export function provideAppServices(app: App, services: AppServices): void {
  app.provide('pocketBaseService', services.pocketBaseService)
  app.provide('mapService', services.mapService)
  app.provide('lexiconService', services.lexiconService)
  app.provide('audioService', services.audioService)
}
