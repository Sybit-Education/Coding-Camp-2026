export interface CurrentWeather {
  temperature: number
  icon: string
  condition: string
  wind_speed: number
  precipitation: number
}

export interface CurrentWeatherResponse {
  weather: CurrentWeather
}
