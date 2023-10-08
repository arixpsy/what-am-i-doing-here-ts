export const Environment = {
  DEV: 'dev',
  PROD: 'prod',
} as const

export type Environment = (typeof Environment)[keyof typeof Environment]
