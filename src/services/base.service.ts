import type { KyInstance } from 'ky'
import type { AuthService } from './auth.service'
import { TableService } from './table.service'

export class BaseService {
  private client: KyInstance
  private baseName: string
  private authService: AuthService
  private tableCache: Map<string, TableService> = new Map()

  constructor(client: KyInstance, baseName: string, authService: AuthService) {
    this.client = client
    this.baseName = baseName
    this.authService = authService
  }

  table(tableName: string, viewName?: string): TableService {
    const cacheKey = `${tableName}:${viewName || ''}`
    if (!this.tableCache.has(cacheKey)) {
      const tableService = new TableService(this.client, this.baseName, tableName, this.authService, viewName)
      this.tableCache.set(cacheKey, tableService)
    }
    // biome-ignore lint/style/noNonNullAssertion: Cache is always set
    return this.tableCache.get(cacheKey)!
  }
}
