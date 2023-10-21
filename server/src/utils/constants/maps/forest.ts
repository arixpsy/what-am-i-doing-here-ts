import { type MapConfig, Map } from '../../../@types/map.js'

export const FOREST_CONFIG = {
  key: Map.FOREST,
  dimensions: {
    height: 560,
    width: 1024,
  },
  platform: [
    {
      height: 50,
      width: 1024,
      x: 512, // 1024 / 2
      y: 535, // (560 - 50) + (50 / 2)
    },
  ],
  spawn: {
    x: 512,
    y: 300,
  },
  portals: {
    1: {
      x: 940,
      y: 460,
      mapKey: Map.STREET,
      portal: 1,
    },
  },
} satisfies MapConfig
