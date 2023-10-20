import Phaser from 'phaser'
import { Socket } from 'socket.io-client'
import { PlayerObject } from '../@types'
import { ImageKey } from '../@types/image'
import { SoundKey } from '../@types/sound'
import { UpdateStateBody } from '../../../server/src/@types/game'
import { MapConfig } from '../../../server/src/@types/map'
import { Sprite } from '../../../server/src/@types/sprite'
import { InputController } from '../utils/inputController'
import SpriteData from '../utils/constants/sprite'

export default class BaseMap extends Phaser.Scene {
	private io: Socket | undefined
	private config: MapConfig
	private backgroundImageKey: ImageKey
	private backgroundSoundKey: SoundKey
	private playerStates: UpdateStateBody = {}
	private playerObjects: Record<string, PlayerObject> = {}
	// private inputController?: InputController

	constructor(
		mapConfig: MapConfig,
		backgroundImageKey: ImageKey,
		soundkey: SoundKey
	) {
		super(mapConfig.key)
		this.config = mapConfig
		this.backgroundImageKey = backgroundImageKey
		this.backgroundSoundKey = soundkey
	}

	init() {
		this.io = this.game.registry.get('socket')
		// this.inputController = new InputController(this, this.io)
		new InputController(this, this.io)
	}

	preload() {}

	create() {
		this.loadMap()
		this.loadSound()
		this.setupSocket()
	}

	addPlayer(
		id: string,
		isLocalPlayer: boolean,
		displayName: string,
		spriteType: Sprite
	) {
		const { x: spawnX, y: spawnY } = this.config.spawn
		const spriteConfig = SpriteData[spriteType]

		let sprite = this.add.sprite(0, 15, spriteConfig.idle.key)
		const nameLabel = this.add.text(0, 0, displayName, {
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
		sprite.play(spriteConfig.idle.key, true)

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
		this.add.image(0, 0, this.backgroundImageKey).setOrigin(0, 0)
	}

	loadSound() {
		const soundManager = this.sound as Phaser.Sound.HTML5AudioSoundManager

		if (!soundManager.get(SoundKey.JUMP)) {
			soundManager.add(SoundKey.JUMP)
		}

		if (!soundManager.get(SoundKey.PORTAL)) {
			soundManager.add(SoundKey.PORTAL)
		}

		if (!soundManager.get(this.backgroundSoundKey)) {
			soundManager.add(this.backgroundSoundKey)
		}

		soundManager.play(this.backgroundSoundKey, {
			loop: true,
		})
	}

	setupSocket() {
		this.io?.on('update state', (data: { players: UpdateStateBody }) => {
			const newPlayerState = data.players

			// Update state for existing player sprites
			for (const key of Object.keys(this.playerObjects)) {
				if (this.playerStates[key]) {
					const spriteConfig = SpriteData[this.playerStates[key].spriteType]

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
						this.playerObjects[key].sprite.play(
							spriteConfig.moving?.key || '',
							true
						)
					} else {
						this.playerObjects[key].sprite.play(spriteConfig.idle.key, true)
					}
				} else {
					this.playerObjects[key].container.destroy()
					delete this.playerObjects[key]
				}
			}

			// Add new sprites
			for (const key of Object.keys(this.playerStates)) {
				if (!this.playerObjects[key]) {
					const isLocalPlayer = key == this.io?.id
					const { displayName, spriteType } = this.playerStates[key]
					this.addPlayer(key, isLocalPlayer, displayName, spriteType)
				}
			}

			this.playerStates = newPlayerState
		})
	}
}
