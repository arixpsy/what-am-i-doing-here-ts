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
	private input: Record<Command, boolean> = {
		up: false,
		down: false,
		left: false,
		right: false,
		jump: false,
	}
	private justPressed = false

	constructor(
		scene: Phaser.Scene,
		io: Socket,
		extendedActions: Partial<Record<Command, () => void>>
	) {
		this.io = io

		for (const c in this.input) {
			const command = c as Command
			const key = scene.input.keyboard?.addKey(commandKeyCodes[command])

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
}
