import { type MapConfig, Map } from '../../../@types/map.js'
import { FOREST_CONFIG } from './forest.js'

export const MAP_CONFIG: Record<Map, MapConfig> = {
  [Map.FOREST]: FOREST_CONFIG
}