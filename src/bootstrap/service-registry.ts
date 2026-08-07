import { MapService } from '@/services/map.service'
import type { App } from 'vue'
import type { Router } from 'vue-router'
import { PocketBaseService } from '@/services/pocket-base.service'
import { LexiconService } from '@/services/lexicon.service'
import { BirdRecognitionService } from '@/services/bird-recognition.service'
import { AudioService } from '@/services/audio.service'
import { WeatherService } from '@/services/weather.service'
import { WarningService } from '@/services/warning.service'

export function createAppServices(_router: Router) {
  const mapService = new MapService()
  const pocketBaseService = new PocketBaseService()
  const lexiconService = new LexiconService(pocketBaseService)
  const birdRecognitionService = new BirdRecognitionService()
  const audioService = new AudioService(pocketBaseService)
  const weatherService = new WeatherService()
  const warningService = new WarningService(pocketBaseService)

  return {
    pocketBaseService,
    mapService,
    lexiconService,
    birdRecognitionService,
    audioService,
    weatherService,
    warningService,
  }
}

export type AppServices = ReturnType<typeof createAppServices>

export function provideAppServices(app: App, services: AppServices): void {
  app.provide('pocketBaseService', services.pocketBaseService)
  app.provide('mapService', services.mapService)
  app.provide('lexiconService', services.lexiconService)
  app.provide('birdRecognitionService', services.birdRecognitionService)
  app.provide('audioService', services.audioService)
  app.provide('weatherService', services.weatherService)
  app.provide('warningService', services.warningService)
}
