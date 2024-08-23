import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, jest, test } from 'bun:test'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { Client, OpenApiClient } from '../src/Client'
import type { components, paths } from './templates'

const SECRET = 'secret'
const BASE_URL = 'http://localhost:3721/api'

describe('template', () => {
  let client: Client
  let openapi: OpenApiClient<paths>

  let mockFetch: jest.Mock
  describe('request', () => {
    beforeEach(() => {
      mockFetch = jest.fn(() => ({
        json: () => Promise.resolve({}),
        headers: new Headers(),
        text: async () => '',
      }))
      client = new Client({ baseUrl: BASE_URL, fetch: mockFetch })
      client.setSecret(SECRET)
      openapi = client.openapi<paths>()
    })

    afterEach(() => {
      mockFetch.mockClear()
    })

    test('should request with secret', async () => {
      await openapi.GET('/bases/templates/tables/templates/records')
      const request = mockFetch.mock.calls[0][0]

      expect(request).toHaveProperty('url')
      expect(request.url).toBe('http://localhost:3721/api/bases/templates/tables/templates/records')
      expect(request).toHaveProperty('headers')
      expect(request.headers).toBeInstanceOf(Headers)
      expect((request.headers as Headers).get('x-undb-api-token')).toBe(SECRET)
    })

    test('should request with path params', async () => {
      const recordId = 'rec123'
      await openapi.GET('/bases/templates/tables/templates/records/{recordId}', {
        params: { path: { recordId } },
      })

      const request = mockFetch.mock.calls[0][0]
      expect(request.url).toBe(`http://localhost:3721/api/bases/templates/tables/templates/records/${recordId}`)
    })
  })

  describe('response', () => {
    const server = setupServer()

    beforeAll(() => {
      server.listen({
        onUnhandledRequest: (request) => {
          throw new Error(`No request handler found for ${request.method} ${request.url}`)
        },
      })
    })

    beforeEach(() => {
      // NOTE: server.listen must be called before `createClient` is used to ensure
      // the msw can inject its version of `fetch` to intercept the requests.
      client = new Client({ baseUrl: BASE_URL })
      openapi = client.openapi<paths>()
    })

    afterEach(() => server.resetHandlers())
    afterAll(() => server.close())

    test('my API call', async () => {
      const rawData: {
        total: number
        records: (components['schemas']['Record'] & unknown)[]
      } = {
        total: 1,
        records: [
          {
            id: 'rec123',
            displayValues: {},
            values: {
              Title: 'hello',
              id: 'rec123',
              createdAt: '2021-01-01',
              createdBy: 'user123',
              updatedAt: '2021-01-01',
              updatedBy: 'user123',
              autoIncrement: 1,
              Cover: [],
              shareId: 'share123',
              Creator: 'Undb',
            },
          },
        ],
      }

      server.use(
        http.get(`${BASE_URL}/bases/templates/tables/templates/records`, () =>
          HttpResponse.json(rawData, { status: 200 })
        )
      )

      const response = await openapi.GET('/bases/templates/tables/templates/records')

      expect(response.data).toEqual(rawData)
      expect(response.error).toBeUndefined()
    })
  })
})
