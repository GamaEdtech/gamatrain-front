import { ref } from 'vue'
import { useThreeJS } from '../useThreejs'
import * as THREE from 'three'

const useChestModel = async (): Promise<{
  model: THREE.Group<THREE.Object3DEventMap>
  chestInteractions: (character: THREE.Object3D) => boolean
  animation: () => { play: () => void, stop: () => void }
  update: (delta: number) => void
  setChestPosition: (position: THREE.Vector3, rotation: THREE.Euler) => void
  mixer: THREE.AnimationMixer | null
} | null> => {
  try {
    const { loadModel } = useThreeJS()
    const chestGlb = await loadModel('/game/castle/treasure_chest.glb')

    const chest = chestGlb.scene

    // Remove all objects named 'Sand' from the model by traversing all children
    chest.traverse((object) => {
      if (object.name.includes('Sand')) {
        console.log('Found sand object:', object.name)
        object.parent?.remove(object)
      }
    })

    chest.scale.set(25, 25, 25)

    const INTERACTION_DISTANCE = 80
    const chestPosition = ref<THREE.Vector3 | null>(null)

    const chestInteractions = (character: THREE.Object3D): boolean => {
      if (!chestPosition.value) return false
      const distanceToChest = character.position.distanceTo(chestPosition.value)

      if (distanceToChest < INTERACTION_DISTANCE) {
        return true
      }
      return false
    }

    let mixer: THREE.AnimationMixer | null = null

    const update = (delta: number) => {
      if (mixer) mixer.update(delta)
    }

    const setChestPosition = (position: THREE.Vector3, rotation: THREE.Euler) => {
      chest.position.set(position.x, position.y, position.z)
      chest.rotation.set(rotation.x, rotation.y, rotation.z)

      chestPosition.value = position
    }

    const animation = (): { play: () => void, stop: () => void } => {
      if (!mixer) {
        mixer = new THREE.AnimationMixer(chest)
      }

      const action = mixer.clipAction(chestGlb.animations[0], chest)
      const clip = chestGlb.animations[0]

      const play = () => {
        const duration = clip.duration
        const halfDuration = duration / 2

        console.log('play')
        action.reset().play()

        setTimeout(() => {
          action.paused = true
        }, halfDuration * 1000)
      }

      const stop = () => {
        action.stop()
      }

      return { play, stop }
    }

    return {
      model: chest,
      chestInteractions,
      animation,
      update,
      setChestPosition,
      mixer,
    }
  }
  catch (error) {
    console.log(error)
    console.log('cant load model')
    return null
  }
}

export default useChestModel
