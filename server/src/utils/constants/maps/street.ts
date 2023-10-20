import { type MapConfig, Map } from '../../../@types/map.js'

export const STREET_CONFIG = {
  key: Map.STREET,
  dimensions: {
    height: 638,
    width: 1234,
  },
  platform: [
    {
      height: 184,
      width: 1234,
      x: 617, // 1234 / 2
      y: 546, // (638 - 184) + (184 / 2)
    },
  ],
  spawn: {
    x: 512,
    y: 300,
  },
} satisfies MapConfig 

