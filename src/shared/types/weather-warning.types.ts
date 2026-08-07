export interface WeatherWarning {
  event: string
  headline: string
  description: string
  severity: string
  onset: string
  expires: string
}

export interface WeatherWarningResponse {
  features: {
    properties: WeatherWarning
  }[]
}
