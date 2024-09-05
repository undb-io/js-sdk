import type { KyInstance } from 'ky'

interface AuthResponse {
  user: {
    id: string
    email: string
  }
}

export class AuthService {
  private client: KyInstance
  private token: string | null = null
  private isUsingCookie = false

  constructor(client: KyInstance) {
    this.client = client
  }

  async loginWithEmail(email: string, password: string): Promise<AuthResponse> {
    if (this.token) {
      throw new Error('Already authenticated with API token.')
    }
    const response = await this.client.post('auth/login', { json: { email, password } }).json<AuthResponse>()
    this.isUsingCookie = true
    return response
  }

  setToken(token: string) {
    if (this.isUsingCookie) {
      throw new Error('Already authenticated with email and password.')
    }
    this.token = token
    this.client = this.client.extend({
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    })
  }

  getToken(): string | null {
    return this.token
  }

  isAuthenticated(): boolean {
    return this.token !== null || this.isUsingCookie
  }
}
