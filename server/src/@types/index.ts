export const Environment = {
  DEV: 'dev',
  PROD: 'prod',
} as const

export type Environment = (typeof Environment)[keyof typeof Environment]

export type Coordinates = { x: number; y: number }

export type Dimensions = {
  height: number
  width: number
}
