import { type Player } from './../../@types/game.js'
import { type Map } from './../../@types/map.js'
import { Sprite } from '../../@types/sprite.js'
import { generateSprite } from './matter.js'
import { MAP_CONFIG } from './../../utils/constants/maps/index.js'

export const createPlayer = (
  spriteType: Sprite,
  displayName: string,
  map: Map,
  portalKey: number
): Player => {
  let spawnX = MAP_CONFIG[map].spawn.x
  let spawnY = MAP_CONFIG[map].spawn.y

  if (portalKey) {
    spawnX = MAP_CONFIG[map].portals[portalKey].x
    spawnY = MAP_CONFIG[map].portals[portalKey].y + 25
  }

  return {
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
      isEnteringPortal: false,
    },
    body: generateSprite({ x: spawnX, y: spawnY }),
  }
}
