import Phaser from 'phaser'
import { Socket } from 'socket.io-client'
import { Command } from './../../../server/src/@types/command'

const commandKeyCodes: Record<Command, number> = {
	up: Phaser.Input.Keyboard.KeyCodes.W,
	down: Phaser.Input.Keyboard.KeyCodes.S,
	left: Phaser.Input.Keyboard.KeyCodes.A,
	right: Phaser.Input.Keyboard.KeyCodes.D,
	jump: Phaser.Input.Keyboard.KeyCodes.SPACE,
} as const

export class InputController {
	private io?: Socket
	private scene: Phaser.Scene
	private input: Record<Command, boolean> = {
		up: false,
		down: false,
		left: false,
		right: false,
		jump: false,
	}
	private keys: Record<Command, Phaser.Input.Keyboard.Key | undefined> = {
		up: undefined,
		down: undefined,
		left: undefined,
		right: undefined,
		jump: undefined,
	}
	private justPressed = false

	constructor(
		scene: Phaser.Scene,
		io: Socket,
		extendedActions: Partial<Record<Command, () => void>>
	) {
		this.scene = scene
		this.io = io

		for (const c in this.input) {
			const command = c as Command
			const key = scene.input.keyboard?.addKey(commandKeyCodes[command])!
			this.keys[command] = key

			key?.on('down', () => {
				if (this.input[command] === false) {
					this.justPressed = true
				}

				this.input[command] = true

				if (this.justPressed === true) {
					this.emitInput()

					const extendedAction = extendedActions[command]
					if (extendedAction) {
						extendedAction()
					}

					this.justPressed = false
				}
			})

			key?.on('up', () => {
				this.input[command] = false
				this.emitInput()
			})
		}
	}

	emitInput() {
		this.io?.emit('userCommands', this.input)
	}

	enableKeyCapture() {
		for (const key of Object.keys(this.keys)) {
			const commandKey = key as Command
			const phaserKey = this.keys[commandKey]
			if (phaserKey) phaserKey.enabled = true
		}

		this.scene.input.keyboard?.enableGlobalCapture()
	}

	disableKeyCapture() {
		for (const key of Object.keys(this.keys)) {
			const commandKey = key as Command
			const phaserKey = this.keys[commandKey]
			if (phaserKey) phaserKey.enabled = false
		}

		this.scene.input.keyboard?.disableGlobalCapture()
	}
}
