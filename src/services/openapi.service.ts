import createClient, { type Client } from 'openapi-fetch'
import type { AuthService } from './auth.service'

export class OpenApiService {
  private authService: AuthService
  private baseUrl: string
  private fetchFn?: typeof fetch

  constructor(baseUrl: string, authService: AuthService, fetchFn?: typeof fetch) {
    this.authService = authService
    this.baseUrl = baseUrl
    this.fetchFn = fetchFn
  }

  getClient<Paths extends {}>(): Client<Paths> {
    const client = createClient<Paths>({
      baseUrl: this.baseUrl,
      fetch: this.fetchFn,
    })

    client.use({
      onRequest: ({ request }) => {
        const token = this.authService.getToken()
        if (token) {
          request.headers.set('X-Undb-Api-Token', token)
        }
      },
    })
    return client
  }
}
