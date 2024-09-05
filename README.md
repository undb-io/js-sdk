# UndbSDK

UndbSDK is a TypeScript SDK for interacting with the Undb API. It provides authentication services, base services, and an OpenAPI client.

## Installation

Install UndbSDK using npm:

```bash
npm install @undb/js-sdk
# or
yarn add @undb/js-sdk
# or
pnpm add @undb/js-sdk
# or
bun add @undb/js-sdk
```

## Usage

Import and use UndbSDK in your project:

```typescript
import { UndbSDK } from '@undb/js-sdk'

const sdk = new UndbSDK({
  baseURL: 'http://localhost:3721/openapi', // https://app.undb.io/openapi if you are using the hosted version
  fetch: fetch, // Optional, use a custom fetch function
})

sdk.auth.setToken('secret')

const client = sdk.getOpenapiClient<paths>()

const res = await client.GET('/bases/templates/tables/templates/records')
```

### Authentication

Access the authentication service using the `auth` property:

#### Set token

```typescript
sdk.auth.setToken('secret')
```

### Usage with Base & Table names

Get a `BaseService` instance using the `base` method:

```typescript
const baseName = 'your-base-name'
const baseService = sdk.base(baseName)
// Access a specific table
const tableService = baseService.table('your-table-name')

// Get records
const records = await tableService.getRecords()
// Create a record
const newRecord = await tableService.createRecord({ values: { / your field values / } })
// Update a record
const updatedRecord = await tableService.updateRecord('record-id', { values: { / updated field values / } })
// Delete a record
await tableService.deleteRecord('record-id')
```

#### Access a specific view

```typescript
const viewService = baseService.table('your-table-name', 'your-view-name')

// Get records
const records = await viewService.getRecords()
```

### Usage with OpenAPI Client

Get a `OpenApiClient` instance using the `getOpenapiClient` method:

```typescript
const client = sdk.getOpenapiClient<paths>()

const res = await client.GET('/bases/templates/tables/templates/records')
```

#### Generate OpenAPI types from undb

TODO

### Development

```bash
bun install
bun run test:watch
```

### License

[MIT](./LICENSE)
