import type { MicroService } from './micro-service.service'
import type { GuidedToursResponse } from '@/shared/types/tour-guides.types'

export class TourGuidesService {
  constructor(private microService: MicroService) {}

  async getTourGuides(): Promise<GuidedToursResponse> {
    return this.microService.request<GuidedToursResponse>('api/guided-tours/mettnau')
  }
}
