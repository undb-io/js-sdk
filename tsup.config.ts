import { defineConfig } from 'tsup'
import { name, version } from './package.json'

export default defineConfig((overrideOptions) => {
  const isProd = overrideOptions.env?.NODE_ENV === 'production'

  return {
    entry: ['src/index.ts'],
    minify: isProd,
    clean: true,
    sourcemap: true,
    dts: true,
    format: ['cjs', 'esm'],
    define: {
      PACKAGE_NAME: `"${name}"`,
      PACKAGE_VERSION: `"${version}"`,
    },
  }
})
