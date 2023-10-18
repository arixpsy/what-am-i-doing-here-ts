import Phaser from 'phaser'
import { Socket } from 'socket.io-client'
import MapData from '../utils/constants/map'
import { InputController } from '../utils/inputController'
import { UpdateStateBody } from '../../../server/src/@types/game'
import { PlayerObject } from '../@types'

export default class BaseMap extends Phaser.Scene {
	private io: Socket | undefined
	private playerStates: UpdateStateBody = {}
	private playerObjects: Record<string, PlayerObject> = {}
	// private inputController?: InputController

	constructor() {
		super('baseMap')
	}

	init() {
		this.io = this.game.registry.get('socket')
		// this.inputController = new InputController(this, this.io)
		new InputController(this, this.io)
	}

	preload() {}

	create() {
		this.loadMap()
		this.setupSocket()
		this.io?.connect()
	}

	addPlayer(id: string, isLocalPlayer: boolean) {
		const { x: spawnX, y: spawnY } = MapData.FOREST.spawn

		let sprite = this.add.sprite(0, 15, 'PINK_BEAN_IDLE')
		const nameLabel = this.add.text(0, 0, 'Player', {
			fontFamily: 'monospace',
			backgroundColor: 'rgba(0,0,0,0.7)',
			padding: {
				x: 5,
				y: 2,
			},
		})
		nameLabel.setOrigin(0.5, 0)
		nameLabel.setY(20)
		let container = this.add
			.container(spawnX, spawnY, [sprite, nameLabel])
			.setSize(30, 30)

		sprite.setOrigin(0.5, 1)
		sprite.play('PINK_BEAN_IDLE', true)

		this.playerObjects[id] = {
			sprite,
			container,
			nameLabel,
		}

		if (isLocalPlayer) {
			this.cameras.main.setBounds(0, 0, 1024, 560)
			this.cameras.main.startFollow(container, true)
		}
	}

	loadMap() {
		this.add.image(0, 0, MapData.FOREST.backgroundImage).setOrigin(0, 0)
	}

	setupSocket() {
		this.io?.on('update state', (data: { players: UpdateStateBody }) => {
			const newPlayerState = data.players
			for (const key of Object.keys(this.playerObjects)) {
				if (this.playerStates[key]) {
					this.playerObjects[key].container.setX(
						this.playerStates[key].position.x
					)
					this.playerObjects[key].container.setY(
						this.playerStates[key].position.y + 5
					)

					const { isFacingLeft, isFacingRight, isMoving } =
						this.playerStates[key].state
					if (isFacingLeft) {
						this.playerObjects[key].sprite.flipX = false
					} else if (isFacingRight) {
						this.playerObjects[key].sprite.flipX = true
					}

					if (isMoving) {
						this.playerObjects[key].sprite.play('PINK_BEAN_MOVING', true)
					} else {
						this.playerObjects[key].sprite.play('PINK_BEAN_IDLE', true)
					}
				} else {
					this.playerObjects[key].container.destroy()
					delete this.playerObjects[key]
				}
			}

			for (const key of Object.keys(this.playerStates)) {
				if (!this.playerObjects[key]) {
					const isLocalPlayer = key == this.io?.id
					this.addPlayer(key, isLocalPlayer)
				}
			}

			this.playerStates = newPlayerState
		})
	}

	update() {}
}
