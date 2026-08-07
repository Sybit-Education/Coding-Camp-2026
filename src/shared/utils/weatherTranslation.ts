import type { Component } from 'vue'

import {
  SunIcon,
  CloudIcon,
  CloudSunIcon,
  CloudRainIcon,
  CloudSnowIcon,
  CloudLightningIcon,
  CloudFogIcon,
} from '@lucide/vue'

// Gets an Lucide-Icon of the weather type
export function getWeatherIcon(icon: string): Component {
  const iconMappings: Record<string, Component> = {
    clear: SunIcon,
    'partly-cloudy': CloudSunIcon,
    rain: CloudRainIcon,
    snow: CloudSnowIcon,
    thunder: CloudLightningIcon,
    fog: CloudFogIcon,
    cloud: CloudIcon,
  }

  const weatherIcon = Object.entries(iconMappings).find(([key]) =>
    icon.toLowerCase().includes(key),
  )?.[1]

  return weatherIcon ?? CloudIcon
}

// Translate the current weather conditions into german
export function translateWeatherCondition(condition: string): string {
  const conditionTranslations: Record<string, string> = {
    dry: 'Trocken',
    clear: 'Klar',
    'partly cloudy': 'Teilweise bewölkt',
    cloudy: 'Bewölkt',
    rain: 'Regen',
    snow: 'Schnee',
    fog: 'Nebel',
    thunderstorm: 'Gewitter',
  }
  return conditionTranslations[condition.toLowerCase()] ?? condition
}
