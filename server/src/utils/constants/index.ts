import { Environment } from './../../@types/index.js'

export const Env: Record<string, string> = {
  ENV: process.env.ENV ?? Environment.DEV,
  PORT: process.env.PORT ?? '3000',
  FE_BASE_URL: process.env.VITE_BASE_URL ?? '',
  ADMIN_USERNAME: process.env.ADMIN_USERNAME ?? 'admin',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ?? 'password',
}

export const CORS_ORIGIN: Record<Environment, Array<string>> = {
  [Environment.DEV]: ['http://localhost:8080'],
  [Environment.PROD]: [Env.FE_BASE_URL],
}
