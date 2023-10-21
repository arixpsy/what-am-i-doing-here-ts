import { type MapConfig, Map } from '../../../@types/map.js'

export const STREET_CONFIG = {
  key: Map.STREET,
  dimensions: {
    height: 638,
    width: 1234,
  },
  platform: [
    {
      height: 86,
      width: 1234,
      x: 617, // 1234 / 2
      y: 595, // (638 - 86) + (86 / 2)
    },
  ],
  spawn: {
    x: 512,
    y: 300,
  },
  portals: {
    1: {
      x: 1150,
      y: 502,
      mapKey: Map.FOREST,
      portal: 1,
    },
  },
} satisfies MapConfig
