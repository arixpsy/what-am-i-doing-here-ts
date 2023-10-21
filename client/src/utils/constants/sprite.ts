import { Dimensions } from './../../../../server/src/@types'
import { Sprite } from './../../../../server/src/@types/sprite'
import pinkBeanIdle from './../../assets/sprites/pinkBean/pink-bean-idle.png'
import pinkBeanMoving from './../../assets/sprites/pinkBean/pink-bean-moving.png'
import portalIdle from './../../assets/sprites/portal/portal.png'

type SpriteSheet = {
	spriteSheet: string
	key: string
	framerate: number
}

type SpriteData = {
	dimensions: Dimensions
	idle: SpriteSheet
	moving?: SpriteSheet
	key: Sprite
	label: string
}

const SpriteData: Record<Sprite, SpriteData> = {
	[Sprite.PINK_BEAN]: {
		dimensions: {
			height: 100,
			width: 100,
		},
		idle: {
			spriteSheet: pinkBeanIdle,
			key: Sprite.PINK_BEAN + '_IDLE',
			framerate: 4,
		},
		moving: {
			spriteSheet: pinkBeanMoving,
			key: Sprite.PINK_BEAN + '_MOVING',
			framerate: 7,
		},
		key: Sprite.PINK_BEAN,
		label: 'Pink Bean',
	},
	[Sprite.PORTAL]: {
		dimensions: {
			height: 122,
			width: 127,
		},
		idle: {
			spriteSheet: portalIdle,
			key: 'PORTAL_IDLE',
			framerate: 6,
		},
		key: Sprite.PORTAL,
		label: 'Portal'
	},
}

export default SpriteData
