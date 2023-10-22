import Phaser from 'phaser'
import { Socket } from 'socket.io-client'
import { PlayerObject } from '../@types'
import { ImageKey } from '../@types/image'
import { SoundKey } from '../@types/sound'
import { Coordinates } from '../../../server/src/@types'
import { UpdateStateBody } from '../../../server/src/@types/game'
import { MapConfig, Map } from '../../../server/src/@types/map'
import { Sprite } from '../../../server/src/@types/sprite'
import { InputController } from '../utils/inputController'
import SpriteData from '../utils/constants/sprite'
import chatUI from './../assets/html/chat.html?raw'

export default class BaseMap extends Phaser.Scene {
	private io: Socket | undefined
	private config: MapConfig
	private backgroundImageKey: ImageKey
	private backgroundSoundKey: SoundKey
	private inputController?: InputController
	private playerStates: UpdateStateBody = {}
	private playerObjects: Record<string, PlayerObject> = {}

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
		this.io = this.game.registry.get('socket') as Socket
		this.inputController = new InputController(this, this.io, {
			up: async () => {
				try {
					await this.io?.emitWithAck('enter portal')
					this.sound.play(SoundKey.PORTAL)
				} catch (err) {
					console.log(err)
				}
			},
		})
	}

	preload() {}

	create() {
		this.cameras.main.fadeOut(0, 0, 0, 0)
		this.loadMap()
		this.loadSound()
		this.loadPortal()
		this.loadChatUI()
		this.setupSocket()
		this.setupSceneListener()
	}

	addPlayer(
		id: string,
		isLocalPlayer: boolean,
		displayName: string,
		spriteType: Sprite,
		position: Coordinates
	) {
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
			.container(position.x, position.y, [sprite, nameLabel])
			.setSize(30, 30)

		sprite.setOrigin(0.5, 1)
		sprite.play(spriteConfig.idle.key, true)

		this.playerObjects[id] = {
			sprite,
			container,
			nameLabel,
		}

		if (isLocalPlayer) {
			this.cameras.main.fadeIn(750, 0, 0, 0)
			this.cameras.main.setBounds(
				0,
				0,
				this.config.dimensions.width,
				this.config.dimensions.height
			)
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

	loadPortal() {
		for (const key of Object.keys(this.config.portals)) {
			const portalKey = key as unknown as number
			const portal = this.config.portals[portalKey]
			const newPortal = this.add.sprite(
				portal.x,
				portal.y + 50,
				SpriteData.PORTAL.idle.key
			)
			newPortal.play(SpriteData.PORTAL.idle.key)
			newPortal.setOrigin(0.5, 1)
		}
	}

	loadChatUI() {
		const chatUIElement = this.add.dom(0, 0).createFromHTML(chatUI)
		chatUIElement.setOrigin(0, 1)
		chatUIElement.setY(500)
		chatUIElement.setScrollFactor(0)
		chatUIElement.setScale(1)

		const enterKey = this.input.keyboard?.addKey(
			Phaser.Input.Keyboard.KeyCodes.ENTER
		)

		enterKey &&
			enterKey.on('down', () => {
				const newMessageInput = document.getElementById(
					'new-message-input'
				) as HTMLInputElement
				const isFocused = document.activeElement === newMessageInput
				if (isFocused) {
					const message = newMessageInput.value.trim()
					if (message !== '') {
						this.io?.emit('send message', message)
					}
					newMessageInput.value = ''
					newMessageInput.blur()
					this.inputController?.enableKeyCapture()
				} else {
					newMessageInput.focus()
					this.inputController?.disableKeyCapture()
				}
			})
	}

	createMessageBubble(playerId: string, message: string) {
		const player = this.playerObjects[playerId]
		if (!player) return
		if (player.chatBubble) {
			this.playerObjects[playerId].chatBubble?.destroy()
			delete this.playerObjects[playerId].chatBubble
		}

		const displayName = this.playerStates[playerId].displayName
		const messageBubble = this.add.text(0, -35, `${displayName}: ${message}`, {
			fontFamily: 'monospace',
			fontSize: '10px',
			backgroundColor: '#FFF',
			color: '#000',
			padding: {
				x: 5,
				y: 2,
			},
			wordWrap: {
				width: 80,
				useAdvancedWrap: true,
			},
		})

		messageBubble.setOrigin(0.5, 1)
		this.playerObjects[playerId].container.add(messageBubble)
		this.playerObjects[playerId].chatBubble = messageBubble

		this.time.delayedCall(
			5000,
			(playerId: string, oldMessageBubble: Phaser.GameObjects.Text) => {
				const player = this.playerObjects[playerId]
				if (!player) return
				const { container } = player
				if (container.exists(oldMessageBubble)) {
					this.playerObjects[playerId].chatBubble?.destroy()
					delete this.playerObjects[playerId].chatBubble
				}
			},
			[playerId, messageBubble]
		)
	}

	addMessageToContainer(playerId: string, message: string) {
		const player = this.playerStates[playerId]
		if (!player) return
		const displayName = player.displayName
		const messageContainer = document.getElementById('message-container')!
		messageContainer.innerText += displayName + ': ' + message
		messageContainer.innerHTML += '<br />'
		messageContainer.scrollTop = messageContainer.scrollHeight
	}

	setupSceneListener() {
		this.events.addListener('shutdown', () => this.unmount())
	}

	setupSocket() {
		this.io?.on(
			'update state',
			(data: { players: UpdateStateBody; map: string }) => {
				if (data.map !== this.config.key) return
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
						const { displayName, spriteType, position } = this.playerStates[key]
						this.addPlayer(
							key,
							isLocalPlayer,
							displayName,
							spriteType,
							position
						)
					}
				}

				this.playerStates = newPlayerState
			}
		)

		this.io?.on('join map', (mapKey: Map) => {
			if (this.scene.getStatus(mapKey) !== Phaser.Scenes.RUNNING) {
				this.scene.start(mapKey)
			}
		})

		this.io?.on(
			'chat message',
			(data: { message: string; playerId: string }) => {
				this.createMessageBubble(data.playerId, data.message)
				this.addMessageToContainer(data.playerId, data.message)
			}
		)

		this.io?.on('jump', () => {
			this.sound.play(SoundKey.JUMP)
		})
	}

	unmount() {
		this.sound.stopByKey(this.backgroundSoundKey)
		this.io?.removeAllListeners('update state')
		this.io?.removeAllListeners('join map')
		this.io?.removeAllListeners('chat message')
		this.io?.removeAllListeners('jump')
		this.playerStates = {}
		this.playerObjects = {}
	}
}
