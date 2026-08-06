import type { Warning } from '@/shared/types/warning.types.ts'
import type { PocketBaseService } from './pocket-base.service'

export class WarningService {
  constructor(readonly pocketBaseService: PocketBaseService) {}

  async getWarningById(id: string): Promise<Warning> {
    const warning = await this.pocketBaseService.getById<Warning>('warnings', id)
    const result: Warning = {
      ...warning,
    }

    return result
  }

  async getWarnings(): Promise<Warning[]> {
    return await this.pocketBaseService.getAll('warnings')
  }
}
