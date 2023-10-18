import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import http from 'http'
import Matter from 'matter-js'
import { Server } from 'socket.io'
import {
  Environment,
} from './@types/index.js'
import { Map } from './@types/map.js'
import type { MapEntities, UpdateStateBody } from './@types/game.js'
import { Env, CORS_ORIGIN } from './utils/constants/index.js'
import { engineConfig } from './utils/constants/matter.js'
import { MAP_CONFIG } from './utils/constants/maps/index.js'
import { toVertices } from './utils/functions/matter.js'
import { generatePlatforms, generateWalls } from './utils/functions/matter.js'
import { FOREST_CONFIG } from './utils/constants/maps/forest.js'

const port = Env.PORT
const env = Env.ENV as Environment
const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: CORS_ORIGIN[env],
    // credentials: true,
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
  // socket(io)
})

const MapEngines: Record<Map, Matter.Engine> = {
  FOREST: Matter.Engine.create(engineConfig),
}

const MapEntities: Record<Map, MapEntities> = (() => {
  const { FOREST } = MAP_CONFIG
  return {
    FOREST: {
      walls: generateWalls(FOREST.dimensions),
      platforms: generatePlatforms(FOREST.platform),
      players: {}
    },
  }
})()

for (const MapKey of Object.values(Map)) {
  const engine = MapEngines[MapKey].world
  const walls = MapEntities[MapKey].walls
  const platforms = MapEntities[MapKey].platforms
  Matter.Composite.add(engine, [
    ...walls,
    ...platforms,
  ])
}



const frameRate = 1000 / 30

setInterval(() => {
  for (const key of Object.keys(MapEntities.FOREST.players)) {
    const {
      command,
      body,
      state: { isInAir },
    } = MapEntities.FOREST.players[key]
    if (command) {
      if (command.jump && !isInAir) {
        MapEntities.FOREST.players[key].state.isInAir = true
        Matter.Body.applyForce(body, body.position, { x: 0, y: -0.03 })
      }

      if (isInAir && parseFloat(body.velocity.y.toFixed(10)) === 0) {
        MapEntities.FOREST.players[key].state.isInAir = false
      }

      const position = { ...body.position }
      if (command.right && !command.left) {
        position.x += 5
        MapEntities.FOREST.players[key].state.isFacingRight = true
        MapEntities.FOREST.players[key].state.isFacingLeft = false
        MapEntities.FOREST.players[key].state.isMoving = true
      } else if (!command.right && command.left) {
        position.x -= 5
        MapEntities.FOREST.players[key].state.isFacingRight = false
        MapEntities.FOREST.players[key].state.isFacingLeft = true
        MapEntities.FOREST.players[key].state.isMoving = true
      } else if (!command.right && !command.left) {
        MapEntities.FOREST.players[key].state.isMoving = false
      }
      Matter.Body.setPosition(body, position)
    }
  }

  Matter.Engine.update(MapEngines.FOREST, frameRate)

  const players: UpdateStateBody = {}
  for (const key of Object.keys(MapEntities.FOREST.players)) {
    players[key] = {
      vertices: toVertices(MapEntities.FOREST.players[key].body),
      position: MapEntities.FOREST.players[key].body.position,
      state: MapEntities.FOREST.players[key].state,
    }
  }

  io.emit('update state', {
    walls: MapEntities.FOREST.walls.map(toVertices),
    platforms: MapEntities.FOREST.platforms.map(toVertices),
    players,
  })
}, frameRate)

io.on('connection', (socket) => {
  console.log(`🟢 A user connected: ${socket.id}`)

  MapEntities.FOREST.players[socket.id] = {
    command: {
      up: false,
      down: false,
      left: false,
      right: false,
      jump: false,
    },
    state: {
      isInAir: true,
      isFacingLeft: false,
      isFacingRight: true,
      isMoving: false,
    },
    body: Matter.Bodies.rectangle(
      MAP_CONFIG.FOREST.spawn.x,
      MAP_CONFIG.FOREST.spawn.y,
      50,
      50,
      {
        inertia: Infinity,
      }
    ),
  }
  MapEntities.FOREST.players[socket.id].body.collisionFilter.group = -1
  MapEntities.FOREST.players[socket.id].body.friction = 0
  Matter.Composite.add(
    MapEngines.FOREST.world,
    MapEntities.FOREST.players[socket.id].body
  )

  socket.on('disconnect', function () {
    console.log(`⛔ A user disconnected: ${socket.id}`)
    Matter.Composite.remove(
      MapEngines.FOREST.world,
      MapEntities.FOREST.players[socket.id].body
    )
    delete MapEntities.FOREST.players[socket.id]
  })

  socket.on('userCommands', function (data) {
    MapEntities.FOREST.players[socket.id].command = data
  })

  socket.on('register', (cb) => cb(FOREST_CONFIG.dimensions))
})
