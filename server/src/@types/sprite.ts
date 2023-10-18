export const Sprite = {
  PINK_BEAN: 'PINK_BEAN',
} as const

export type Sprite = (typeof Sprite)[keyof typeof Sprite]
