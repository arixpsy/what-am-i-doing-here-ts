import { type MapConfig, Map } from '../../../@types/map.js'
import { FOREST_CONFIG } from './forest.js'
import { STREET_CONFIG } from './street.js'

const MAP_CONFIG: Record<Map, MapConfig> = {
  [Map.FOREST]: FOREST_CONFIG,
  [Map.STREET]: STREET_CONFIG
}

export default MAP_CONFIG