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
    return result
  }

  async getRefrences<T extends RecordModel>(
    searchTable: string,
    tableName: string,
    parentId: string,
  ): Promise<T[]> {
    return await this.pb.collection(searchTable).getFullList({
      filter: `${tableName} ~ "${parentId}"`,
    })
  }

  async getBy<T extends RecordModel>(
    table: string,
    column: string,
    value: string,
  ): Promise<T | undefined> {
    try {
      return await this.pb.collection(table).getFirstListItem(`${column}="${value}"`)
    } catch {
      return undefined
    }
  }
}
