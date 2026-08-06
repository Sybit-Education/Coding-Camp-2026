import { environment } from '@/environments/environment'
import type { CurrentWeather, CurrentWeatherResponse } from '@/shared/types/weather.types'


// Take the needed WeatherData from the BrightSky-Page
const LAT = 47.7275
const LON = 9.0045

export class WeatherService {
  constructor() {}



  async getCurrentWeather(): Promise<CurrentWeather> {
    const response = await fetch(`${environment.WEATHER_API_URL}?lat=${LAT}&lon=${LON}`)

    console.log(`${environment.WEATHER_API_URL}?lat=${LAT}&lon=${LON}`)

    if (!response.ok) {
      throw new Error('Fehler beim Laden der Wetterdaten')
    }

    const data: CurrentWeatherResponse = await response.json()

    console.log('result of API reques: ', data.weather)
    return data.weather
  }
}

