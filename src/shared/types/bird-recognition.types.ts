export interface BirdRecognitionConfig {
  extensions: string[]
  upload_limit_mb: number
  poll_interval_ms: number
  default_language: string
}

export interface BirdRecognitionLanguages {
  languages: string[]
  default: string
}

export interface BirdRecognitionJob {
  job_id: string
  status: 'queued' | 'processing' | 'done' | 'error'
  stage: string
  progress: number
  result?: BirdRecognitionResult | null
  error?: string | null
}

export interface CreateBirdRecognitionJobOptions {
  latitude?: number
  longitude?: number
  week?: number
  language?: string
}

export interface BirdDetection {
  species: string
  species_code: string
  confidence: number
  start: number
  end: number
  species_localized: string | null
  scientific_name: string | null
}

export interface BirdRecognitionResult {
  meta: {
    filename: string | null
    lat: number | null
    lon: number | null
    week: number | null
    lang: string
  }
  detections: BirdDetection[]
}

export interface BirdRecognitionJobCreated {
  job_id: string
}

export interface BirdRecognitionJob {
  job_id: string
  status: 'queued' | 'processing' | 'done' | 'error'
  stage: string
  progress: number
  result?: BirdRecognitionResult | null
  error?: string | null
}

export interface BirdRecognitionLocation {
  latitude: number
  longitude: number
}
