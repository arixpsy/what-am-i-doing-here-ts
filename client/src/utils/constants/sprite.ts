import { Dimensions } from './../../../../server/src/@types'
import { Sprite } from './../../../../server/src/@types/sprite'
import pinkBeanIdle from './../../assets/sprites/pinkBean/pink-bean-idle.png'
import pinkBeanMoving from './../../assets/sprites/pinkBean/pink-bean-moving.png'
import kinoIdle from './../../assets/sprites/kino/kino-idle.png'
import kinoMoving from './../../assets/sprites/kino/kino-moving.png'
import microSlimeIdle from './../../assets/sprites/micro_slime/micro-slime-idle.png'
import microSlimeMoving from './../../assets/sprites/micro_slime/micro-slime-moving.png'
import neroIdle from './../../assets/sprites/nero/nero-idle.png'
import neroMoving from './../../assets/sprites/nero/nero-moving.png'
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
	[Sprite.KINO]: {
		dimensions: {
			height: 100,
			width: 100,
		},
		idle: {
			spriteSheet: kinoIdle,
			key: Sprite.KINO + '_IDLE',
			framerate: 4,
		},
		moving: {
			spriteSheet: kinoMoving,
			key: Sprite.KINO + '_MOVING',
			framerate: 7,
		},
		key: 'KINO',
		label: 'Kino'
	},
	[Sprite.MICRO_SLIME]: {
		dimensions: {
			height: 100,
			width: 100,
		},
		idle: {
			spriteSheet: microSlimeIdle,
			key: Sprite.MICRO_SLIME + '_IDLE',
			framerate: 2,
		},
		moving: {
			spriteSheet: microSlimeMoving,
			key: Sprite.MICRO_SLIME + '_MOVING',
			framerate: 5,
		},
		key: 'MICRO_SLIME',
		label: 'Micro Slime'
	},
	[Sprite.NERO]: {
		dimensions: {
			height: 100,
			width: 100,
		},
		idle: {
			spriteSheet: neroIdle,
			key: Sprite.NERO + '_IDLE',
			framerate: 3,
		},
		moving: {
			spriteSheet: neroMoving,
			key: Sprite.NERO + '_MOVING',
			framerate: 7,
		},
		key: 'NERO',
		label: 'Nero'
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
