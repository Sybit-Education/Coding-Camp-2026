import type { MicroService } from './micro-service.service'
import type { TourGuide } from '@/shared/types/tour-guides.types'

export class TourGuidesService {
  constructor(private microService: MicroService) {}

  async getTourGuides(): Promise<TourGuide[]> {
    return this.microService.request<TourGuide[]>('/api/tour-guides')
  }
}
