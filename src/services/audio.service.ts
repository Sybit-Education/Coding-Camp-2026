import type { AnimalAudioEntry, AnimalAudioListEntry } from '@/shared/types/audio.types'
import type { PocketBaseService } from './pocket-base.service'

export class AudioService {
  constructor(readonly pocketBaseService: PocketBaseService) {}

  // Gets audio entries by lexikon id
  async getyAudioIDByAnimalID(id: string): Promise<AnimalAudioListEntry[]> {
    return await this.pocketBaseService.getRefrences<AnimalAudioEntry>(
      'audio_reference',
      'relation',
      id,
    )
  }
}
