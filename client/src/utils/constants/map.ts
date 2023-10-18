import { MapConfig, Map } from "../../../../server/src/@types/map"
import { MAP_CONFIG } from "../../../../server/src/utils/constants/maps"
import { ImageKey } from "../../@types/image"
import { SoundKey } from "../../@types/sound"

type MapData = MapConfig & {
  backgroundImage: ImageKey,
  sound: SoundKey,
}

const MapData: Record<Map, MapData> = {
  [Map.FOREST]: {
    ...MAP_CONFIG.FOREST,
    backgroundImage: ImageKey.FOREST_BACKGROUND,
    sound: SoundKey.MY_PRINCE_MY_KINGDOM,
  }
}

export default MapData