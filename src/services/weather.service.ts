import type { Component } from 'vue'
import type { CurrentWeather, CurrentWeatherResponse } from '@/shared/types/weather.types'

import {
  SunIcon,
  CloudIcon,
  CloudSunIcon,
  CloudRainIcon,
  CloudSnowIcon,
  CloudLightningIcon,
  CloudFogIcon,
} from '@lucide/vue'

//Location METTNAU
const LAT = 47.7275
const LON = 9.0045

//Take the needed WeatherData from the BrightSky-Page
export async function getCurrentWeather(): Promise<CurrentWeather> {
  const response = await fetch(`https://api.brightsky.dev/current_weather?lat=${LAT}&lon=${LON}`)

  if (!response.ok) {
    throw new Error('Fehler beim Laden der Wetterdaten')
  }

  const data: CurrentWeatherResponse = await response.json()

  return data.weather
}

//Gets an Lucide-Icon of the weather type
export function getWeatherIcon(icon: string): Component {
  switch (true) {
    case icon.includes('clear'):
      return SunIcon

    case icon.includes('partly-cloudy'):
      return CloudSunIcon

    case icon.includes('rain'):
      return CloudRainIcon

    case icon.includes('snow'):
      return CloudSnowIcon

    case icon.includes('thunder'):
      return CloudLightningIcon

    case icon.includes('fog'):
      return CloudFogIcon

    case icon.includes('cloud'):
      return CloudIcon

    default:
      return CloudIcon
  }
}

//Translate the current weather conditions into german
export function translateWeatherCondition(condition: string): string {
  switch (condition.toLowerCase()) {
    case 'dry':
      return 'Trocken'

    case 'clear':
      return 'Klar'

    case 'partly cloudy':
      return 'Teilweise bewölkt'

    case 'cloudy':
      return 'Bewölkt'

    case 'rain':
      return 'Regen'

    case 'snow':
      return 'Schnee'

    case 'fog':
      return 'Nebel'

    case 'thunderstorm':
      return 'Gewitter'

    default:
      return condition
  }
}
