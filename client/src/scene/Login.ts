import Phaser from 'phaser'
import { Socket } from 'socket.io-client'
import { ImageKey } from '../@types/image'
import { SceneKey } from '../@types/scene'
import { SoundKey } from '../@types/sound'
import loginForm from './../assets/html/loginForm.html?raw'
import SpriteData from '../utils/constants/sprite'
import { Map } from '../../../server/src/@types/map'

export default class Login extends Phaser.Scene {
	private io: Socket | undefined

	constructor() {
		super(SceneKey.LOGIN)
	}

	init() {
		this.io = this.game.registry.get('socket')
	}

	create() {
		this.setupSocket()
		this.setupSceneListener()
		this.loadSound()
		this.loadBackground()
		this.loadForm()
	}

	loadSound() {
		const soundManager = this.sound

		if (!soundManager.get(SoundKey.LOGIN)) {
			soundManager.add(SoundKey.LOGIN)
		}

		soundManager.play(SoundKey.LOGIN, { loop: true })
	}

	loadBackground() {
		this.add.image(500, 250, ImageKey.LOGIN_BACKGROUND)
		this.add.rectangle(500, 250, 1000, 500, 0x000000, 0.3)
	}

	loadForm() {
		const form = this.add.dom(0, 0).createFromHTML(loginForm)
		form.setOrigin(0, 0)
		form.addListener('submit')

		const spriteInput = document.getElementById(
			'sprite-input'
		) as HTMLSelectElement
		const displayNameInput = document.getElementById(
			'display-name-input'
		) as HTMLInputElement

		for (const sprite of Object.values(SpriteData)) {
			spriteInput.innerHTML += `<option value='${sprite.key}'>${sprite.label}</option>`
		}

		form.on('submit', (event: any) => {
			event.preventDefault()
			if (!this.io) return

			this.io.auth = {
				displayName: displayNameInput.value,
				spriteType: spriteInput.value,
			}

			this.io.connect()
		})
	}

	setupSceneListener() {
		this.events.addListener('shutdown', () => this.unmount())
	}

	setupSocket() {
		this.io?.on('join map', (mapKey: Map) => {
			if (this.scene.getStatus(mapKey) !== Phaser.Scenes.RUNNING) {
				this.scene.start(mapKey)
			}
		})
	}

	unmount() {
		this.sound.stopByKey(SoundKey.LOGIN)
		this.io?.removeAllListeners('join map')
	}
}
