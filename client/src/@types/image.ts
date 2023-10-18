export const ImageKey = {
	FOREST_BACKGROUND: 'FOREST_BACKGROUND_IMAGE',
} as const

export type ImageKey = (typeof ImageKey)[keyof typeof ImageKey]
