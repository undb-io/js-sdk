import { describe, expect, test } from 'bun:test'
import { Client } from '../src/Client'

describe('Client', () => {
  test('should be defined', () => {
    expect(Client).toBeDefined()
  })

  test('should create a client', () => {
    const client = new Client({ baseUrl: 'https://example.com' })

    expect(client).toBeDefined()
  })
})
