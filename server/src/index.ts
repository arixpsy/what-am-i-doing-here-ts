import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import http from 'http'
import Matter from 'matter-js'
import { Server } from 'socket.io'
import {
  Coordinates,
  Environment,
  Map,
  MapEntities,
  PlayerState,
  UpdateStateBody,
} from './@types/index.js'
import { Env, CORS_ORIGIN } from './utils/constants'
import { engineConfig } from './utils/constants/matter.js'
import { forestConfig } from './utils/constants/maps.js'
import { toVertices } from './utils/functions/matter.js'
import { generatePlatforms, generateWalls } from './utils/functions/matter.js'

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

const MapEntities: Record<string, MapEntities> = {
  FOREST: {
    WALLS: generateWalls(forestConfig.dimensions),
    PLATFORMS: generatePlatforms(forestConfig.platform),
    PLAYERS: {},
  },
}

Matter.Composite.add(MapEngines.FOREST.world, [
  ...MapEntities.FOREST.WALLS,
  ...MapEntities.FOREST.PLATFORMS,
])

const frameRate = 1000 / 30

setInterval(() => {
  for (const key of Object.keys(MapEntities.FOREST.PLAYERS)) {
    const {
      command,
      body,
      state: { isInAir },
    } = MapEntities.FOREST.PLAYERS[key]
    if (command) {
      if (command.jump && !isInAir) {
        MapEntities.FOREST.PLAYERS[key].state.isInAir = true
        Matter.Body.applyForce(body, body.position, { x: 0, y: -0.03 })
      }

      if (isInAir && parseFloat(body.velocity.y.toFixed(10)) === 0) {
        MapEntities.FOREST.PLAYERS[key].state.isInAir = false
      }

      const position = { ...body.position }
      if (command.right && !command.left) {
        position.x += 5
        MapEntities.FOREST.PLAYERS[key].state.isFacingRight = true
        MapEntities.FOREST.PLAYERS[key].state.isFacingLeft = false
        MapEntities.FOREST.PLAYERS[key].state.isMoving = true
      } else if (!command.right && command.left) {
        position.x -= 5
        MapEntities.FOREST.PLAYERS[key].state.isFacingRight = false
        MapEntities.FOREST.PLAYERS[key].state.isFacingLeft = true
        MapEntities.FOREST.PLAYERS[key].state.isMoving = true
      } else if (!command.right && !command.left) {
        MapEntities.FOREST.PLAYERS[key].state.isMoving = false
      }
      Matter.Body.setPosition(body, position)
    }
  }

  Matter.Engine.update(MapEngines.FOREST, frameRate)

  const players: UpdateStateBody = {}
  for (const key of Object.keys(MapEntities.FOREST.PLAYERS)) {
    players[key] = {
      vertices: toVertices(MapEntities.FOREST.PLAYERS[key].body),
      position: MapEntities.FOREST.PLAYERS[key].body.position,
      state: MapEntities.FOREST.PLAYERS[key].state,
    }
  }

  io.emit('update state', {
    walls: MapEntities.FOREST.WALLS.map(toVertices),
    platforms: MapEntities.FOREST.PLATFORMS.map(toVertices),
    players,
  })
}, frameRate)

io.on('connection', (socket) => {
  console.log(`🟢 A user connected: ${socket.id}`)

  MapEntities.FOREST.PLAYERS[socket.id] = {
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
      forestConfig.spawn.x,
      forestConfig.spawn.y,
      50,
      50,
      {
        inertia: Infinity,
      }
    ),
  }
  MapEntities.FOREST.PLAYERS[socket.id].body.collisionFilter.group = -1
  MapEntities.FOREST.PLAYERS[socket.id].body.friction = 0
  Matter.Composite.add(
    MapEngines.FOREST.world,
    MapEntities.FOREST.PLAYERS[socket.id].body
  )

  socket.on('disconnect', function () {
    console.log(`⛔ A user disconnected: ${socket.id}`)
    Matter.Composite.remove(
      MapEngines.FOREST.world,
      MapEntities.FOREST.PLAYERS[socket.id].body
    )
    delete MapEntities.FOREST.PLAYERS[socket.id]
  })

  socket.on('userCommands', function (data) {
    MapEntities.FOREST.PLAYERS[socket.id].command = data
  })

  socket.on('register', (cb) => cb(forestConfig.dimensions))
})
