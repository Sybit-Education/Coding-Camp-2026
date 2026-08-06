export interface CurrentWeather {
  temperature: number
  icon: string
  condition: string

  // Similar to the file names
  wind_speed_10: number
  precipitation_10: number
}

export interface CurrentWeatherResponse {
  weather: CurrentWeather
}
