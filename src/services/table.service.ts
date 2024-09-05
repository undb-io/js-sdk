import type { KyInstance } from 'ky'
import type { AuthService } from './auth.service'

interface IRecord {
  id: string
  values: Record<string, unknown>
}

interface CreateRecordPayload {
  values: Record<string, unknown>
}

interface UpdateRecordPayload {
  values: Record<string, unknown>
}

export class TableService {
  private client: KyInstance
  private baseName: string
  private tableName: string
  private viewName?: string
  private authService: AuthService

  constructor(client: KyInstance, baseName: string, tableName: string, authService: AuthService, viewName?: string) {
    this.client = client
    this.baseName = baseName
    this.tableName = tableName
    this.viewName = viewName
    this.authService = authService
  }

  private checkAuth() {
    if (!this.authService.isAuthenticated()) {
      throw new Error('Authentication is missing. Please login first.')
    }
  }

  private getUrl(path: string): string {
    if (this.viewName) {
      return `bases/${this.baseName}/tables/${this.tableName}/views/${this.viewName}/${path}`
    }
    return `bases/${this.baseName}/tables/${this.tableName}/${path}`
  }

  async getRecords(): Promise<IRecord[]> {
    this.checkAuth()
    const response = await this.client.get(this.getUrl('records')).json<{ records: IRecord[] }>()
    return response.records
  }

  async createRecord(payload: CreateRecordPayload): Promise<IRecord> {
    this.checkAuth()
    const response = await this.client.post(this.getUrl('records'), { json: payload }).json<IRecord>()
    return response
  }

  async updateRecord(recordId: string, payload: UpdateRecordPayload): Promise<IRecord> {
    this.checkAuth()
    const response = await this.client.patch(this.getUrl(`records/${recordId}`), { json: payload }).json<IRecord>()
    return response
  }

  async deleteRecord(recordId: string): Promise<void> {
    this.checkAuth()
    await this.client.delete(this.getUrl(`records/${recordId}`))
  }
}
