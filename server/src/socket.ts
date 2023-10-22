import Matter from 'matter-js'
import { Server } from 'socket.io'
import { Command } from './@types/command.js'
import { Map } from './@types/map.js'
import { Sprite } from './@types/sprite.js'
import type { MapEntities } from './@types/game.js'
import MAP_CONFIG from './utils/constants/maps/index.js'
import { playerJoinRoom } from './utils/functions/game.js'

const setupSocket = (
  io: Server,
  MapEngines: Record<Map, Matter.Engine>,
  MapEntities: Record<Map, MapEntities>
) => {
  io.on('connection', (socket) => {
    const displayName = socket.handshake.auth.displayName
    const spriteType = socket.handshake.auth.spriteType as Sprite
    const isPlayer = displayName && spriteType
    let mapKey: Map = Map.FOREST
    let portalKey = 0

    if (isPlayer) {
      console.log(`🟢 User '${displayName}' has connected`)
      playerJoinRoom(
        io,
        socket,
        MapEngines,
        MapEntities,
        mapKey,
        portalKey,
        spriteType,
        displayName
      )
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
            playerJoinRoom(
              io,
              socket,
              MapEngines,
              MapEntities,
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

    socket.on('userCommands', (data: Record<Command, boolean>) => {
      MapEntities[mapKey].players[socket.id].command = data
    })

    socket.on('send message', (message: string) => {
      io.to(mapKey).emit('chat message', {
        message,
        playerId: socket.id,
      })
    })

    socket.on('register', (cb) =>
      cb({
        FOREST: MAP_CONFIG.FOREST.dimensions,
        STREET: MAP_CONFIG.STREET.dimensions,
      })
    )
  })
}

export default setupSocket
