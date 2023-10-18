import type { Coordinates, Dimensions } from './index.js'

export const Map = {
  FOREST: 'FOREST',
} as const

export type Map = (typeof Map)[keyof typeof Map]

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
}
