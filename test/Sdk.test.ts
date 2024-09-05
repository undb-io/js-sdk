import { beforeEach, describe, expect, it, jest } from 'bun:test'
import { UndbSDK } from '../src/Sdk'
import { AuthService } from '../src/services/auth.service'
import { BaseService } from '../src/services/base.service'

describe('UndbSDK', () => {
  const baseURL = 'http://example.com'
  const fetchFn = jest.fn()

  let sdk: UndbSDK

  beforeEach(() => {
    sdk = new UndbSDK({ baseURL, fetch: fetchFn })
  })

  it('should initialize authService and openApiService', () => {
    expect(sdk.auth).toBeInstanceOf(AuthService)
    // getOpenapiClient() 返回的不是 OpenApiService 实例，而是一个由 OpenApiService 创建的客户端
    expect(sdk.getOpenapiClient()).toBeDefined()
    expect(typeof sdk.getOpenapiClient()).toBe('object')
  })

  it('should return authService instance', () => {
    const authService = sdk.auth
    expect(authService).toBeInstanceOf(AuthService)
  })

  it('should return a BaseService instance from base method', () => {
    const baseName = 'testBase'
    const baseService = sdk.base(baseName)
    expect(baseService).toBeInstanceOf(BaseService)
    expect(sdk.base(baseName)).toBe(baseService) // should return the same instance from cache
  })

  it('should return an OpenApi client', () => {
    const client = sdk.getOpenapiClient()
    expect(client).toBeDefined()
  })
})
