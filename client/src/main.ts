import Phaser from 'phaser'
import io from 'socket.io-client'
import Loader from './scene/Loader'
import Login from './scene/Login'
import Forest from './scene/Forest'

const config: Phaser.Types.Core.GameConfig = {
	width: 1000,
	height: 500,
	pixelArt: true,
	parent: 'phaser',
	dom: {
		createContainer: true,
	},
	scene: [Loader, Login, Forest],
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
	},
}

const game = new Phaser.Game(config)

game.registry.set(
	'socket',
	io(import.meta.env.VITE_BASE_URL || 'http://localhost:3000', {
		withCredentials: true,
		autoConnect: false,
		transports: ['websocket'],
	})
)
