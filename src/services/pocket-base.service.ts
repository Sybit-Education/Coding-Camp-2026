import { environment } from '@/environments/environment'
import PocketBase, { type RecordModel } from 'pocketbase'

export class PocketBaseService {
  private readonly pb: PocketBase

  constructor() {
    this.pb = new PocketBase(environment.pocketBaseAddress)
  }

  // ************** getter **************
  async getAll<T>(table: string): Promise<T[]> {
    return await this.pb.collection(table).getFullList()
  }

  async getById<T>(table: string, id: string): Promise<T> {
    return await this.pb.collection(table).getFirstListItem(`id="${id}"`)
  }

  async getImageUrl<T extends RecordModel>(entry: T, imagePath: string): Promise<string> {
    const result = await this.pb.files.getURL(entry, imagePath)
    console.log('getImageUrl', result)
    return result
  }
}
