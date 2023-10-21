import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import http from 'http'
import Matter from 'matter-js'
import { Server, Socket } from 'socket.io'
import { Environment } from './@types/index.js'
import type { MapEntities, UpdateStateBody } from './@types/game.js'
import { Map } from './@types/map.js'
import type { Sprite } from './@types/sprite.js'
import { Env, CORS_ORIGIN } from './utils/constants/index.js'
import { MAP_CONFIG } from './utils/constants/maps/index.js'
import { engineConfig } from './utils/constants/matter.js'
import { createPlayer } from './utils/functions/game.js'
import {
  toVertices,
  generatePlatforms,
  generateWalls,
  generatePortals,
} from './utils/functions/matter.js'

const port = Env.PORT
const env = Env.ENV as Environment
const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: CORS_ORIGIN[env],
    credentials: true,
  },
})

app.use(express.static('public'))

app.use(
  cors({
    origin: CORS_ORIGIN[env],
  })
)

app.get('/healthcheck', (_, res) => {
  res.send('MatterJs + Express + Socket.io Server')
})

server.listen(port, () => {
  console.log(`🟢 ${env} server is running on port ${port}`)
})

const MapEngines: Record<Map, Matter.Engine> = {
  FOREST: Matter.Engine.create(engineConfig),
  STREET: Matter.Engine.create(engineConfig),
}

const MapEntities: Record<Map, MapEntities> = (() => {
  const { FOREST, STREET } = MAP_CONFIG
  return {
    FOREST: {
      walls: generateWalls(FOREST.dimensions),
      platforms: generatePlatforms(FOREST.platform),
      portals: generatePortals(FOREST.portals),
      players: {},
    },
    STREET: {
      walls: generateWalls(STREET.dimensions),
      platforms: generatePlatforms(STREET.platform),
      portals: generatePortals(STREET.portals),
      players: {},
    },
  }
})()

for (const MapKey of Object.values(Map)) {
  const engine = MapEngines[MapKey].world
  const walls = MapEntities[MapKey].walls
  const platforms = MapEntities[MapKey].platforms
  const portals = Object.values(MapEntities[MapKey].portals)
  Matter.Composite.add(engine, [...walls, ...platforms, ...portals])
}

const frameRate = 1000 / 30

setInterval(() => {
  for (const key in MapEngines) {
    const mapKey = key as Map
    for (const socketId of Object.keys(MapEntities[mapKey].players)) {
      const {
        command,
        body,
        state: { isInAir, isEnteringPortal },
      } = MapEntities[mapKey].players[socketId]

      if (command && !isEnteringPortal) {
        if (command.jump && !isInAir) {
          MapEntities[mapKey].players[socketId].state.isInAir = true
          Matter.Body.applyForce(body, body.position, { x: 0, y: -0.03 })
        }

        if (isInAir && parseFloat(body.velocity.y.toFixed(10)) === 0) {
          MapEntities[mapKey].players[socketId].state.isInAir = false
        }

        const position = { ...body.position }
        if (command.right && !command.left) {
          position.x += 5
          MapEntities[mapKey].players[socketId].state.isFacingRight = true
          MapEntities[mapKey].players[socketId].state.isFacingLeft = false
          MapEntities[mapKey].players[socketId].state.isMoving = true
        } else if (!command.right && command.left) {
          position.x -= 5
          MapEntities[mapKey].players[socketId].state.isFacingRight = false
          MapEntities[mapKey].players[socketId].state.isFacingLeft = true
          MapEntities[mapKey].players[socketId].state.isMoving = true
        } else if (
          (!command.right && !command.left) ||
          (command.right && command.left)
        ) {
          MapEntities[mapKey].players[socketId].state.isMoving = false
        }
        Matter.Body.setPosition(body, position)
      }
    }
    Matter.Engine.update(MapEngines[mapKey], frameRate)

    const players: UpdateStateBody = {}
    for (const key of Object.keys(MapEntities[mapKey].players)) {
      players[key] = {
        vertices: toVertices(MapEntities[mapKey].players[key].body),
        position: MapEntities[mapKey].players[key].body.position,
        state: MapEntities[mapKey].players[key].state,
        displayName: MapEntities[mapKey].players[key].displayName,
        spriteType: MapEntities[mapKey].players[key].spriteType,
      }
    }

    io.to([mapKey, 'debug']).emit('update state', {
      map: mapKey,
      walls: MapEntities[mapKey].walls.map(toVertices),
      platforms: MapEntities[mapKey].platforms.map(toVertices),
      portals: Object.values(MapEntities[mapKey].portals).map(toVertices),
      players,
    })
  }
}, frameRate)

function AddPlayer(
  io: Server,
  socket: Socket,
  socketId: string,
  mapKey: Map,
  portalKey: number,
  spriteType: Sprite,
  displayName: string
) {
  MapEntities[mapKey].players[socketId] = createPlayer(
    spriteType,
    displayName,
    mapKey,
    portalKey
  )
  Matter.Composite.add(
    MapEngines[mapKey].world,
    MapEntities[mapKey].players[socketId].body
  )
  socket.join(mapKey)
  io.to(socket.id).emit('join map', mapKey)
  console.log(`🟢 User '${displayName}' has join ${mapKey}`)
}

io.on('connection', (socket) => {
  const displayName = socket.handshake.auth.displayName
  const spriteType = socket.handshake.auth.spriteType as Sprite
  const isPlayer = displayName && spriteType
  let mapKey: Map = Map.FOREST
  let portalKey = 0

  if (isPlayer) {
    console.log(`🟢 User '${displayName}' has connected`)
    AddPlayer(io, socket, socket.id, mapKey, portalKey, spriteType, displayName)
  } else {
    socket.join('debug')
    console.log(`🟢 A debugger has connected: ${socket.id}`)
  }

  socket.on('disconnect', function () {
    if (!isPlayer) {
      console.log(`⛔ A debugger has disconnected: ${socket.id}`)
      return
    }
    console.log(`⛔ User '${displayName}' has disconnected`)

    Matter.Composite.remove(
      MapEngines[mapKey].world,
      MapEntities[mapKey].players[socket.id].body
    )
    delete MapEntities[mapKey].players[socket.id]
  })

  socket.on('enter portal', (callback) => {
    const { state, body } = MapEntities[mapKey].players[socket.id]
    if (!state.isEnteringPortal) {
      for (const key of Object.keys(MapEntities[mapKey].portals)) {
        const pKey = key as unknown as number
        const { portals } = MapEntities[mapKey]
        const { x, y } = portals[pKey].position
        if (
          body.position.x >= x - 25 &&
          body.position.x <= x + 25 &&
          body.position.y >= y - 50 &&
          body.position.y <= y + 50
        ) {
          callback('entering portal')
          MapEntities[mapKey].players[socket.id].state.isEnteringPortal = true
          const newMapKey = MAP_CONFIG[mapKey].portals[pKey].mapKey
          const newPortalKey = MAP_CONFIG[mapKey].portals[pKey].portal
          socket.leave(mapKey)
          AddPlayer(
            io,
            socket,
            socket.id,
            newMapKey,
            newPortalKey,
            spriteType,
            displayName
          )
          Matter.Composite.remove(
            MapEngines[mapKey].world,
            MapEntities[mapKey].players[socket.id].body
          )
          delete MapEntities[mapKey].players[socket.id]
          mapKey = MAP_CONFIG[mapKey].portals[pKey].mapKey
          portalKey = MAP_CONFIG[mapKey].portals[pKey].portal
        }
      }
    }
  })

  socket.on('userCommands', function (data) {
    MapEntities[mapKey].players[socket.id].command = data
  })

  socket.on('register', (cb) =>
    cb({
      FOREST: MAP_CONFIG.FOREST.dimensions,
      STREET: MAP_CONFIG.STREET.dimensions,
    })
  )
})
