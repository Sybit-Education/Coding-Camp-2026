import { environment } from '@/environments/environment'

import type { CurrentWeather, CurrentWeatherResponse } from '@/shared/types/weather.types'

import type { WeatherWarning } from '@/shared/types/weather-warning.types'

// Radolfzell
const LAT = 47.735
const LON = 8.958
// Gemeinde-ID from Radolfzell
const COMMUNITY_ID = '08335063'

// Debug
const TEST_WARNING = false
const TEST_WARNING_AMOUNT = 0

type DwdWarningRegion = {
  polygonGeometry?: {
    coordinates?: number[][][]
  }
}

type DwdWarning = {
  regions?: DwdWarningRegion[]
  [key: string]: unknown
}

function isPointInPolygon(longitude: number, latitude: number, polygon: number[][]) {
  let inside = false

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i] ?? []
    const [xj, yj] = polygon[j] ?? []

    if (xi === undefined || yi === undefined || xj === undefined || yj === undefined) {
      continue
    }

    const intersects = yi > latitude !== yj > latitude
      && longitude < ((xj - xi) * (latitude - yi)) / (yj - yi) + xi

    if (intersects) {
      inside = !inside
    }
  }

  return inside
}

function containsLocation(warning: DwdWarning) {
  return warning.regions?.some((region) => region.polygonGeometry?.coordinates?.some(
    (polygon) => isPointInPolygon(LON, LAT, polygon),
  )) ?? false
}

export class WeatherService {
  constructor() {}

  // Current Weather
  async getCurrentWeather(): Promise<CurrentWeather> {
    const response = await fetch(`${environment.WEATHER_API_URL}?lat=${LAT}&lon=${LON}`)

    if (!response.ok) {
      throw new Error('Fehler beim Laden der Wetterdaten')
    }

    const data: CurrentWeatherResponse = await response.json()

    return data.weather
  }

  // Wetherwarning
  async getWarnings(): Promise<WeatherWarning[]> {
    // Testdaten
    if (TEST_WARNING) {
      return Array.from(
        {
          length: TEST_WARNING_AMOUNT,
        },
        (_, i) => ({
          event: `Test ${i + 1}`,
          headline: `Testwarnung ${i + 1}`,
          description: `Simulierte Warnung Nummer ${i + 1}`,

          severity: 'Severe',

          onset: new Date().toISOString(),

          expires: new Date(Date.now() + 3600000).toISOString(),
        }),
      )
    }

    const response = await fetch(environment.WEATHER_WARNING_API_URL)

    if (!response.ok) {
      throw new Error('Fehler beim Laden der Wetterwarnungen')
    }

    const data = await response.json()

    console.log('DWD Warnungen:', data)


    const warnings = Array.isArray(data.warnings)
      ? data.warnings.filter(containsLocation)
      : data.warnings?.[COMMUNITY_ID]

    if (!warnings) {
      return []
    }

    return warnings.map((warning: any) => ({
      event: warning.event ?? '',

      headline: warning.headline ?? '',

      description: warning.description ?? '',

      severity: warning.severity ?? '',

      onset: warning.start ?? warning.onset ?? '',

      expires: warning.end ?? warning.expires ?? '',
    }))
  }
}
