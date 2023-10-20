import Matter from 'matter-js'
import { type Player } from './../../@types/game.js'
import { type Map } from './../../@types/map.js'
import { Sprite } from '../../@types/sprite.js'
import { MAP_CONFIG } from './../../utils/constants/maps/index.js'

export const createPlayer = (
  spriteType: Sprite,
  displayName: string,
  map: Map
): Player => ({
  spriteType,
  displayName,
  command: {
    up: false,
    down: false,
    left: false,
    right: false,
    jump: false,
  },
  state: {
    isInAir: true,
    isFacingLeft: false,
    isFacingRight: true,
    isMoving: false,
  },
  // TODO: shift to function folder matter.ts
  body: Matter.Bodies.rectangle(
    MAP_CONFIG[map].spawn.x,
    MAP_CONFIG[map].spawn.y,
    50,
    50,
    {
      inertia: Infinity,
    }
  ),
})
