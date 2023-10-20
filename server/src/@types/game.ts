import Matter from 'matter-js'
import type { Command } from './command.js'
import type { Coordinates } from './index.js'
import type { Sprite } from './sprite.js'

export type PlayerState = {
  isInAir: boolean
  isMoving: boolean
  isFacingLeft: boolean
  isFacingRight: boolean
}

export type Player = {
  spriteType: Sprite
  displayName: string
  command: Record<Command, boolean>
  body: Matter.Body
  state: PlayerState
}

export type MapEntities = {
  walls: Array<Matter.Body>
  platforms: Array<Matter.Body>
  players: Record<string, Player>
}

export type UpdateStateBody = Record<
  string,
  {
    vertices: Array<Coordinates>
    position: Coordinates
    state: PlayerState
    displayName: string
    spriteType: Sprite
  }
>
