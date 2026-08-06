export interface CurrentWeather {
  temperature: number
  icon: string
  condition: string
  wind_speed_10: number
  precipitation_10: number
}

export interface CurrentWeatherResponse {
  weather: CurrentWeather
}
