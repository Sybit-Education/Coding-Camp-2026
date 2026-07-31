import { MapService } from '@/services/map.service'
import { BirdRecognitionService } from '@/services/bird-recognition.service'
import type { App } from 'vue'
import type { Router } from 'vue-router'

export function createAppServices(_router: Router) {
  const mapService = new MapService()
  const birdRecognitionService = new BirdRecognitionService()

  return {
    mapService,
    birdRecognitionService,
  }
}

export type AppServices = ReturnType<typeof createAppServices>

export function provideAppServices(app: App, services: AppServices): void {
  app.provide('mapService', services.mapService)
  app.provide('birdRecognitionService', services.birdRecognitionService)
}
