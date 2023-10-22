export const Sprite = {
  KINO: 'KINO',
  MICRO_SLIME: 'MICRO_SLIME',
  NERO: 'NERO',
  PINK_BEAN: 'PINK_BEAN',
  PORTAL: 'PORTAL'
} as const

export type Sprite = (typeof Sprite)[keyof typeof Sprite]
