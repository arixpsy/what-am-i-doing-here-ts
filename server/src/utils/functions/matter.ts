import Matter from 'matter-js'
import type { portalConfig } from '../../@types/map.js'

export const generateWalls = ({
  height,
  width,
}: {
  height: number
  width: number
}) => [
  Matter.Bodies.rectangle(width / 2, 0, width, 1, { isStatic: true }),
  Matter.Bodies.rectangle(0, height / 2, 1, height, { isStatic: true }),
  Matter.Bodies.rectangle(width, width / 2, 1, width, { isStatic: true }),
  Matter.Bodies.rectangle(width / 2, height, width, 1, { isStatic: true }),
]

export const generatePlatforms = (
  platforms: Array<{
    height: number
    width: number
    x: number
    y: number
  }>
) =>
  platforms.map(({ height, width, x, y }) =>
    Matter.Bodies.rectangle(x, y, width, height, { isStatic: true })
  )

export const generatePortals = (portals: Record<number, portalConfig>) => {
  const portalBodies: Record<number, Matter.Body> = {}
  for (const key of Object.keys(portals)) {
    const { x, y } = portals[key as unknown as number]
    portalBodies[key as unknown as number] = Matter.Bodies.rectangle(
      x,
      y,
      50,
      100,
      { isStatic: true, collisionFilter: { group: -1 } }
    )
  }
  return portalBodies
}

export const toVertices = (e: Matter.Body) =>
  e.vertices.map(({ x, y }) => ({ x, y }))
