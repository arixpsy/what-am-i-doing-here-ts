import { ImageKey } from '../../@types/image'
import forestBg from './../../assets/backgrounds/forest.png'
import loginBg from './../../assets/backgrounds/park.png'
import streetBg from './../../assets/backgrounds/street.gif'
type ImageData = {
	key: ImageKey
	image: string
}

const ImageData: Record<ImageKey, ImageData> = {
	[ImageKey.FOREST_BACKGROUND]: {
		key: ImageKey.FOREST_BACKGROUND,
		image: forestBg,
	},
	[ImageKey.LOGIN_BACKGROUND]: {
		key: ImageKey.LOGIN_BACKGROUND,
		image: loginBg,
	},
	[ImageKey.STREET_BACKGROUND]: {
		key: ImageKey.STREET_BACKGROUND,
		image: streetBg,
	},
}

export default ImageData
