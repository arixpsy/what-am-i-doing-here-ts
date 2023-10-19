import Phaser from 'phaser'
import { SceneKey } from '../@types/scene'
import { ImageKey } from '../@types/image'
import loginForm from './../assets/html/loginForm.html?raw'

export default class Login extends Phaser.Scene {
  constructor() {
    super(SceneKey.LOGIN)
  }

  create() {
    this.add.image(500, 250, ImageKey.LOGIN_BACKGROUND)
		this.add.rectangle(500, 250, 1000, 500, 0x000000, 0.3)
		const form = this.add.dom(0, 0).createFromHTML(loginForm)
		form.setOrigin(0, 0)
		form.addListener('click')

		// const spriteInput = document.getElementById('sprite-input')
		// for (const sprite of Object.values(SPRITE)) {
		// 	if (sprite.KEY !== 'PORTAL') {
		// 		spriteInput.innerHTML += `<option value='${sprite.KEY}'>${sprite.KEY}</option>`
		// 	}
		// }

		// this.element.on('click', (event) => {
		// 	if (event.target.id == 'loginBtn') {
		// 		let username = document.getElementById('username-input').value
		// 		let password = document.getElementById('password-input').value
		// 		this.scene.start('playGame')
		// 	}
		// 	if (event.target.id == 'signUpBtn') {
		// 		this.scene.start('register')
		// 	}
		// 	if (event.target.id == 'instantLoginBtn') {
		// 		const playerInfo = {
		// 			uid: uuidv4(),
		// 			displayName:
		// 				document.getElementById('display-name-input').value,
		// 			spriteType: spriteInput.value,
		// 			channel: 1,
		// 			map: KEY.SCENE.MAP.FOREST,
		// 			portal: 0,
		// 		}
		// 		if (playerInfo.displayName) {
		// 			this.scene.start(playerInfo.map, playerInfo)
		// 		} else {
		// 			alert('Enter a display name')
		// 		}
		// 	}
		// })
  }
}
