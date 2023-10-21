export const Sprite = {
  PINK_BEAN: 'PINK_BEAN',
  PORTAL: 'PORTAL'
} as const

export type Sprite = (typeof Sprite)[keyof typeof Sprite]
