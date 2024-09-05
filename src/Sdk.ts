import ky, { type KyInstance } from 'ky'
import { AuthService } from './services/auth.service'
import { BaseService } from './services/base.service'
import { OpenApiService } from './services/openapi.service'

interface SDKOptions {
  baseURL: string
  fetch?: typeof fetch
}

export class UndbSDK {
  private client: KyInstance
  private authService: AuthService
  private baseCache: Map<string, BaseService> = new Map()
  private openApiService: OpenApiService

  constructor(options: SDKOptions) {
    const { baseURL, fetch: fetchFn } = options
    this.client = ky.create({ prefixUrl: baseURL, credentials: 'include', fetch: fetchFn })
    this.authService = new AuthService(this.client)
    this.openApiService = new OpenApiService(baseURL, this.authService, fetchFn)
  }

  get auth() {
    return this.authService
  }

  base(baseName: string): BaseService {
    if (!this.baseCache.has(baseName)) {
      const baseService = new BaseService(this.client, baseName, this.authService)
      this.baseCache.set(baseName, baseService)
    }
    // biome-ignore lint/style/noNonNullAssertion: Cache is not null
    return this.baseCache.get(baseName)!
  }

  getOpenapiClient<Paths extends {}>() {
    return this.openApiService.getClient<Paths>()
  }
}
