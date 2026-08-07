import { environment } from '@/environments/environment'
import type { CurrentWeather, CurrentWeatherResponse } from '@/shared/types/weather.types'
import type { WeatherWarning } from '@/shared/types/weather-warning.types'

// Coordinates of the weather location
const LAT = 47.7275
const LON = 9.0045

// Debug Tool
const TEST_WARNING = false
const TEST_WARNING_AMOUNT = 0

// Service
export class WeatherService {
  constructor() {}

  // Gets weather from location
  async getCurrentWeather(): Promise<CurrentWeather> {
    const response = await fetch(`${environment.WEATHER_API_URL}?lat=${LAT}&lon=${LON}`)

    // Failed
    if (!response.ok) {
      throw new Error('Fehler beim Laden der Wetterdaten')
    }

    // Fetches
    const data: CurrentWeatherResponse = await response.json()

    // Return
    return data.weather
  }

  // Fetches active weather warnings for the configured location
  async getWarnings(): Promise<WeatherWarning[]> {
    // Returns simulated warnings when test mode is enabled
    if (TEST_WARNING) {
      return Array.from({ length: TEST_WARNING_AMOUNT }, (_, i) => ({
        event: `Test ${i + 1}`,
        headline: `Testwarnung ${i + 1}`,
        description: `Simulierte Warnung Nummer ${i + 1}.`,
        severity: 'Severe',
        onset: new Date().toISOString(),
        expires: new Date(Date.now() + 3600000).toISOString(),
      }))
    }

    const response = await fetch(`${environment.WEATHER_WARNING_API_URL}?lat=${LAT}&lon=${LON}`)

    if (!response.ok) {
      throw new Error('Fehler beim Laden der Wetterwarnungen')
    }

    const data = await response.json()

    // Returns an empty list if no valid warning data is available
    if (!data.features || !Array.isArray(data.features)) {
      return []
    }

    // Extracts warning properties from the API response
    return data.features.map((feature: any) => feature.properties)
  }
}
