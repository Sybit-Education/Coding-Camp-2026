import type { CurrentWeather, CurrentWeatherResponse } from '@/shared/types/weather.types'

const LAT = 47.74
const LON = 8.97

export async function getCurrentWeather(): Promise<CurrentWeather> {
  const response = await fetch(`https://api.brightsky.dev/current_weather?lat=${LAT}&lon=${LON}`)

  if (!response.ok) {
    throw new Error('Fehler beim Laden der Wetterdaten')
  }

  const data: CurrentWeatherResponse = await response.json()

  return data.weather
}
