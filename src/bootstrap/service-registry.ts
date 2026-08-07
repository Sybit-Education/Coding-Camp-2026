import { MapService } from '@/services/map.service'
import type { App } from 'vue'
import type { Router } from 'vue-router'
import { PocketBaseService } from '@/services/pocket-base.service'
import { LexiconService } from '@/services/lexicon.service'
import { BirdRecognitionService } from '@/services/bird-recognition.service'
import { AudioService } from '@/services/audio.service'
import { WeatherService } from '@/services/weather.service'
import { WarningService } from '@/services/warning.service'
import { ObservationService } from '@/services/observation.service'

export function createAppServices(_router: Router) {
  const mapService = new MapService()
  const pocketBaseService = new PocketBaseService()

  const lexiconService = new LexiconService(pocketBaseService)
  const audioService = new AudioService(pocketBaseService)
  const warningService = new WarningService(pocketBaseService)
  const observationService = new ObservationService(pocketBaseService)

  const birdRecognitionService = new BirdRecognitionService()
  const weatherService = new WeatherService()

  return {
    mapService,
    pocketBaseService,
    lexiconService,
    audioService,
    warningService,
    observationService,
    birdRecognitionService,
    weatherService,
  }
}

export type AppServices = ReturnType<typeof createAppServices>

export function provideAppServices(app: App, services: AppServices): void {
  app.provide('mapService', services.mapService)
  app.provide('pocketBaseService', services.pocketBaseService)
  app.provide('lexiconService', services.lexiconService)
  app.provide('audioService', services.audioService)
  app.provide('warningService', services.warningService)
  app.provide('observationService', services.observationService)
  app.provide('birdRecognitionService', services.birdRecognitionService)
  app.provide('weatherService', services.weatherService)
}
