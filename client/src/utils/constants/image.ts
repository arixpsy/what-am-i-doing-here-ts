import { ImageKey } from '../../@types/image'
import forestBg from './../../assets/backgrounds/forest.png'

type ImageData = {
	key: ImageKey
	image: string
}

const ImageData: Record<ImageKey, ImageData> = {
	[ImageKey.FOREST_BACKGROUND]: {
		key: ImageKey.FOREST_BACKGROUND,
		image: forestBg,
	},
}

export default ImageData
