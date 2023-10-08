import { Environment } from './@types'

export const Env: Record<string, string> = {
  ENV: process.env.ENV ?? Environment.DEV,
  PORT: process.env.PORT ?? '3000',
  FE_BASE_URL: process.env.BASE_URL ?? '',
}

export const CORS_ORIGIN: Record<Environment, Array<string>> = {
  [Environment.DEV]: ['http://localhost:8080'],
  [Environment.PROD]: [Env.BASE_URL],
}
