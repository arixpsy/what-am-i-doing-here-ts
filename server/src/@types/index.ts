export const Environment = {
  DEV: 'dev',
  PROD: 'prod',
} as const

export type Environment = (typeof Environment)[keyof typeof Environment]

export const Map = {
  FOREST: 'FOREST',
} as const

export type Map = (typeof Map)[keyof typeof Map]

export type MapConfig = {
  key: Map
  dimensions: {
    height: number
    width: number
  }
  platform: Array<{
    height: number
    width: number
    x: number
    y: number
  }>
  spawn: {
    x: number
    y: number
  }
}

export type MapEntities = {
  WALLS: Array<Matter.Body>
  PLATFORMS: Array<Matter.Body>
  PLAYERS: Record<
    string,
    {
      command: Record<string, boolean>
      body: Matter.Body
      isInAir: boolean
    }
  >
}
