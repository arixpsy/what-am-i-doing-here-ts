import Matter from 'matter-js'
import type { Command } from './command.js'
import type { Coordinates } from './index.js'

export type PlayerState = {
  isInAir: boolean
  isMoving: boolean
  isFacingLeft: boolean
  isFacingRight: boolean
}

export type MapEntities = {
  walls: Array<Matter.Body>
  platforms: Array<Matter.Body>
  players: Record<
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
