export const SceneKey = {
	LOADER: 'LOADER_SCENE',
	LOGIN: 'LOGIN_SCENE',
} as const

export type SceneKey = (typeof SceneKey)[keyof typeof SceneKey]
