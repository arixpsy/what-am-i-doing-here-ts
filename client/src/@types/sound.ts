export const SoundKey = {
	LOGIN: 'LOGIN_AUDIO',
	MY_PRINCE_MY_KINGDOM: 'MY_PRINCE_MY_KINGDOM_AUDIO',
	CAVA_BIEN: 'CAVA_BIEN_AUDIO',

	JUMP: 'JUMP_AUDIO',
	PORTAL: 'PORTAL_AUDIO',
} as const

export type SoundKey = (typeof SoundKey)[keyof typeof SoundKey]
