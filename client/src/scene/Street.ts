import BaseMap from './BaseMap'
import { ImageKey } from '../@types/image'
import { SoundKey } from '../@types/sound'
import MAP_CONFIG from '../../../server/src/utils/constants/maps'

const BACKGROUND_IMAGE_KEY = ImageKey.STREET_BACKGROUND
const BACKGROUND_SOUND_KEY = SoundKey.CAVA_BIEN

export default class Street extends BaseMap {
	constructor() {
		super(MAP_CONFIG.STREET, BACKGROUND_IMAGE_KEY, BACKGROUND_SOUND_KEY)
	}
}
