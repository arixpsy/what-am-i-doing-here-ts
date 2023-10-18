import { SoundKey } from './../../@types/sound'
import titleAudio from './../../assets/sounds/Title.mp3'
import cavaBienAudio from './../../assets/sounds/CavaBien.mp3'
import myPrinceMyKingdomAudio from './../../assets/sounds/MyPrinceMyKingdom.mp3'
import jumpAudio from './../../assets/sounds/effects/Jump.mp3'
import portalAudio from './../../assets/sounds/effects/Portal.mp3'

type SoundData = {
	key: SoundKey
	audio: string
}

const SoundData: Record<SoundKey, SoundData> = {
	[SoundKey.LOGIN]: {
		key: SoundKey.LOGIN,
		audio: titleAudio,
	},
	[SoundKey.MY_PRINCE_MY_KINGDOM]: {
		key: SoundKey.MY_PRINCE_MY_KINGDOM,
		audio: myPrinceMyKingdomAudio,
	},
	[SoundKey.CAVA_BIEN]: {
		key: SoundKey.CAVA_BIEN,
		audio: cavaBienAudio,
	},

	// EFFECTS
	[SoundKey.JUMP]: {
		key: SoundKey.JUMP,
		audio: jumpAudio,
	},
	[SoundKey.PORTAL]: {
		key: SoundKey.PORTAL,
		audio: portalAudio,
	},
}

export default SoundData
