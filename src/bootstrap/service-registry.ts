import { MapService } from '@/services/map.service'
import { BirdRecognitionService } from '@/services/bird-recognition.service'
import type { App } from 'vue'
import type { Router } from 'vue-router'
import { PocketBaseService } from '@/services/pocket-base.service'

export function createAppServices(_router: Router) {
  const mapService = new MapService()
  const birdRecognitionService = new BirdRecognitionService()
  const pocketBaseService = new PocketBaseService()

  return {
    pocketBaseService,
    mapService,
    birdRecognitionService,
  }
}

export type AppServices = ReturnType<typeof createAppServices>

export function provideAppServices(app: App, services: AppServices): void {
  app.provide('pocketBaseService', services.pocketBaseService)
  app.provide('mapService', services.mapService)
  app.provide('birdRecognitionService', services.birdRecognitionService)
}
