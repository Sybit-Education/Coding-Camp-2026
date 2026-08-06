import type { CurrentWeather, CurrentWeatherResponse } from '@/shared/types/weather.types'

// Weather API Environment Variables
const WEATHER_API_URL = import.meta.env.VITE_WEATHER_API_URL
const LAT = 47.7275
const LON = 9.0045

// Take the needed WeatherData from the BrightSky-Page
export async function getCurrentWeather(): Promise<CurrentWeather> {
  const response = await fetch(`${WEATHER_API_URL}?lat=${LAT}&lon=${LON}`)

  if (!response.ok) {
    throw new Error('Fehler beim Laden der Wetterdaten')
  }

  const data: CurrentWeatherResponse = await response.json()

  return data.weather
}
