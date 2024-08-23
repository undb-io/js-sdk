import createClient from 'openapi-fetch'

export { type Client as OpenApiClient } from 'openapi-fetch'

interface ClientOptions {
  baseUrl: string
  fetch?: (input: Request) => Promise<Response>
}

export class Client {
  constructor(private readonly options: ClientOptions) {}

  private secret: string | undefined
  setSecret(secret: string) {
    this.secret = secret
  }

  public openapi<Paths extends {}>() {
    const client = createClient<Paths>({
      baseUrl: this.options.baseUrl,
      fetch: this.options.fetch,
    })

    client.use({
      onRequest: ({ request }) => {
        if (this.secret) {
          request.headers.set('X-Undb-Api-Token', this.secret)
        }
      },
    })

    return client
  }
}
