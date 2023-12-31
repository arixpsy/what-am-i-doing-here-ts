import type { Coordinates, Dimensions } from './index.js'

export const Map = {
  FOREST: 'FOREST',
  STREET: 'STREET',
} as const

export type Map = (typeof Map)[keyof typeof Map]

export type portalConfig = Coordinates & {
  mapKey: Map
  portal: number
}

export type MapConfig = {
  key: Map
  dimensions: Dimensions
  platform: Array<
    Coordinates & {
      height: number
      width: number
    }
  >
  spawn: Coordinates
  portals: Record<number, portalConfig>
}
