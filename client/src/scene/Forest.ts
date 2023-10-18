import BaseMap from './BaseMap'
import { ImageKey } from '../@types/image'
import { SoundKey } from '../@types/sound'
import { MAP_CONFIG } from '../../../server/src/utils/constants/maps'

const BACKGROUND_IMAGE_KEY = ImageKey.FOREST_BACKGROUND
const BACKGROUND_SOUND_KEY = SoundKey.MY_PRINCE_MY_KINGDOM

export default class Forest extends BaseMap {
	constructor() {
		super(MAP_CONFIG.FOREST, BACKGROUND_IMAGE_KEY, BACKGROUND_SOUND_KEY)
	}
}
