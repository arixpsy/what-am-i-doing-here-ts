export const Command = {
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right',
  JUMP: 'jump',
} as const

export type Command = (typeof Command)[keyof typeof Command]
