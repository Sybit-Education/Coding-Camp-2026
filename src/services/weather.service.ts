import { environment } from '@/environments/environment'
import type { CurrentWeather, CurrentWeatherResponse } from '@/shared/types/weather.types'

// Location for the weather
const LAT = 47.7275
const LON = 9.0045

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
}
