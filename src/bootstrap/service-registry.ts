import { MapService } from '@/services/map.service'
import type { App } from 'vue'
import type { Router } from 'vue-router'
import { PocketBaseService } from '@/services/pocket-base.service'
import { LexiconService } from '@/services/lexicon.service'
import { BirdRecognitionService } from '@/services/bird-recognition.service'
import { AudioService } from '@/services/audio.service'
import { WeatherService } from '@/services/weather.service'
import { MicroService } from '@/services/micro-service.service'
import { TourGuidesService } from '@/services/tour-guides.service'
import { WarningService } from '@/services/warning.service'

export function createAppServices(_router: Router) {
  const microService = new MicroService()
  const pocketBaseService = new PocketBaseService()

  const lexiconService = new LexiconService(pocketBaseService)
  const birdRecognitionService = new BirdRecognitionService(microService)
  const tourGuidesService = new TourGuidesService(microService)
  const audioService = new AudioService(pocketBaseService)
  const weatherService = new WeatherService()
  const mapService = new MapService()
  const warningService = new WarningService(pocketBaseService)

  return {
    pocketBaseService,
    mapService,
    lexiconService,
    birdRecognitionService,
    audioService,
    weatherService,
    microService,
    tourGuidesService,
    warningService,
  }
}

export type AppServices = ReturnType<typeof createAppServices>

export function provideAppServices(app: App, services: AppServices): void {
  app.provide('microService', services.microService)
  app.provide('pocketBaseService', services.pocketBaseService)
  app.provide('mapService', services.mapService)
  app.provide('lexiconService', services.lexiconService)
  app.provide('birdRecognitionService', services.birdRecognitionService)
  app.provide('audioService', services.audioService)
  app.provide('weatherService', services.weatherService)
  app.provide('tourGuidesService', services.tourGuidesService)
  app.provide('warningService', services.warningService)
}
