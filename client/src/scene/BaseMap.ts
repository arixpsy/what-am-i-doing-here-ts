import Phaser from 'phaser'
import forestBg from './../assets/backgrounds/forest.png'
import pinkbeanIdle from './../assets/sprites/pinkBean/pink-bean-idle.png'
import pinkbeanMoving from './../assets/sprites/pinkBean/pink-bean-moving.png'
import { Socket } from 'socket.io-client'

export default class BaseMap extends Phaser.Scene {
	private io: Socket | undefined
	private player: Phaser.GameObjects.Container | undefined

	constructor() {
		super('baseMap')
	}

	init() {
		console.log('init')
		this.io = this.game.registry.get('socket')
	}

	preload() {
		console.log('preload')
		this.load.image('background-forest', forestBg)

		this.load.spritesheet('sprite-pink-bean-idle', pinkbeanIdle, {
			frameWidth: 100,
			frameHeight: 100,
		})

		this.load.spritesheet('sprite-pink-bean-moving', pinkbeanMoving, {
			frameWidth: 100,
			frameHeight: 100,
		})
	}

	create() {
		console.log('create')

		this.anims.create({
			key: 'sprite-pink-bean-idle',
			frames: this.anims.generateFrameNumbers('sprite-pink-bean-idle'),
			frameRate: 4,
			repeat: -1,
		})

		this.loadMap()
		this.setupSocket()
		this.io?.connect()
	}

	addPlayer() {
		let spawnX = 200
		let spawnY = 400

		let playerSprite = this.add.sprite(0, 15, 'sprite-pink-bean-idle')
		const newName = this.add.text(0, 0, 'Player', {
			fontFamily: 'monospace',
			backgroundColor: 'rgba(0,0,0,0.7)',
			padding: {
				x: 5,
				y: 2,
			},
		})
		newName.setOrigin(0.5, 0)
		newName.setY(20)
		let container = this.add
			.container(spawnX, spawnY, [playerSprite, newName])
			.setSize(30, 30)

		playerSprite.setOrigin(0.5, 1)
		playerSprite.play('sprite-pink-bean-idle', true)

		this.player = container

		this.cameras.main.setBounds(0, 0, 1024, 560)
		this.cameras.main.startFollow(container, true)
	}

	loadMap() {
		this.add.image(0, 0, 'background-forest').setOrigin(0, 0)
	}

	setupSocket() {
		this.io?.on('connect', () => {
			console.log('connected')
			console.log(this.io?.id)
		})

		this.io?.on('update state', (data) => {
			// console.log(data)
		})
	}

	updatePlayer() {

	}
}
