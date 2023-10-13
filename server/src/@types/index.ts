import Matter from "matter-js"

export const Environment = {
  DEV: 'dev',
  PROD: 'prod',
} as const

export type Environment = (typeof Environment)[keyof typeof Environment]

export const Map = {
  FOREST: 'FOREST',
} as const

export type Coordinates = { x: number; y: number }

export type Map = (typeof Map)[keyof typeof Map]

export type MapConfig = {
  key: Map
  dimensions: {
    height: number
    width: number
  }
  platform: Array<
    Coordinates & {
      height: number
      width: number
    }
  >
  spawn: Coordinates
}

export const Command = {
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right',
  JUMP: 'jump',
} as const

export type Command = (typeof Command)[keyof typeof Command]

export type PlayerState = {
  isInAir: boolean
  isMoving: boolean
  isFacingLeft: boolean
  isFacingRight: boolean
}

export type MapEntities = {
  WALLS: Array<Matter.Body>
  PLATFORMS: Array<Matter.Body>
  PLAYERS: Record<
    string,
    {
      command: Record<Command, boolean>
      body: Matter.Body
      state: PlayerState
    }
  >
}

export type UpdateStateBody = Record<
  string,
  {
    vertices: Array<Coordinates>
    position: Coordinates
    state: PlayerState
  }
>
