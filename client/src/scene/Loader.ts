import Phaser from 'phaser'
import { SceneKey } from '../@types/scene'
import { Map } from '../../../server/src/@types/map'
import SpriteData from '../utils/constants/sprite'
import SoundData from '../utils/constants/sound'
import ImageData from '../utils/constants/image'

export default class Loader extends Phaser.Scene {
	private progressRect?: Phaser.Geom.Rectangle
	private progressCompleteRect?: Phaser.Geom.Rectangle
	private progressBar?: Phaser.GameObjects.Graphics

	constructor() {
		super(SceneKey.LOADER)
	}

	preload() {
    // Load images
    for (const image of Object.values(ImageData)){
      this.load.image(image.key, image.image)
    }

    // Load spritesheets
    for (const sprite of Object.values(SpriteData)) {
			if (sprite.idle) {
				this.load.spritesheet(
					sprite.idle.key,
					sprite.idle.spriteSheet,
					{
						frameWidth: sprite.dimensions.width,
						frameHeight: sprite.dimensions.height,
					}
				)
			}

			if (sprite.moving) {
				this.load.spritesheet(
					sprite.moving.key,
					sprite.moving.spriteSheet,
					{
						frameWidth: sprite.dimensions.width,
						frameHeight: sprite.dimensions.height,
					}
				)
			}
		}

		for (const sound of Object.values(SoundData)) {
			this.load.audio(sound.key, sound.audio)
		}

		this.load.on('progress', this.onLoadProgress, this)
		this.load.on('complete', this.onLoadComplete, this)
		this.createProgressBar()
	}

	create() {
    // Create spritesheet animations
    for (const sprite of Object.values(SpriteData)) {
      if (sprite.idle) {
        this.anims.create({
          key: sprite.idle.key,
          frames: this.anims.generateFrameNumbers(sprite.idle.key),
					frameRate: sprite.idle.framerate,
					repeat: -1,
        })
      }

      if (sprite.moving) {
        this.anims.create({
          key: sprite.moving.key,
          frames: this.anims.generateFrameNumbers(sprite.moving.key),
					frameRate: sprite.moving.framerate,
					repeat: -1,
        })
      }
    }
	}

	createProgressBar() {
		let Rectangle = Phaser.Geom.Rectangle

		this.progressRect = new Rectangle(0, 0,this.cameras.main.width / 2, 50)
		Rectangle.CenterOn(this.progressRect, this.cameras.main.centerX, this.cameras.main.centerY)
		this.progressCompleteRect = Phaser.Geom.Rectangle.Clone(this.progressRect)
		this.progressBar = this.add.graphics()
	}

	onLoadComplete() {
		this.scene.start(Map.FOREST)
	}

	onLoadProgress(progress: number) {
		if (this.progressBar && this.progressRect && this.progressCompleteRect) {
			this.progressRect.width = progress * this.progressCompleteRect.width
			this.progressBar
				.clear()
				.fillStyle(0x222222)
				.fillRectShape(this.progressCompleteRect)
				.fillStyle(0xffffff)
				.fillRectShape(this.progressRect)
		}
	}
}
