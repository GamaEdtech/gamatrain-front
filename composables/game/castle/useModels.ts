import useCastleModel from './useCastleModel'
import type * as THREE from 'three'
import type { Ref } from '@vue/runtime-dom'
import type { DoorModels } from '~/interfaces/DoorModels.interface'
import useChestModel from './useChestModel'

const useModels = async (
  scene: Ref<THREE.Scene>,
  doorModels: DoorModels,
  modelesLoaded: Ref<boolean>,
) => {
  let visibleChest: (status: boolean) => void = () => {}
  let chestInteractions: (character: THREE.Object3D) => boolean = () => false
  let chestAnimation: (() => { play: () => void, stop: () => void }) | null
    = null
  let chestUpdate: (delta: number) => void = () => {}
  let chestPosition: (
    position: THREE.Vector3,
    rotation: THREE.Euler
  ) => void = () => {}

  await Promise.all([useCastleModel(doorModels), useChestModel()]).then(
    (res) => {
      const [castle, chest] = res

      if (!castle) return
      if (!chest) return

      visibleChest = (status) => {
        if (status) {
          castle.add(chest.model)
        }
        else {
          castle.remove(chest.model)
        }
      }

      chestInteractions = chest.chestInteractions
      chestAnimation = chest.animation
      chestUpdate = chest.update
      chestPosition = chest.setChestPosition

      scene.value.add(castle)

      modelesLoaded.value = true
    },
  )

  return {
    visibleChest,
    chestInteractions,
    chestAnimation,
    chestUpdate,
    chestPosition,
  }
}

export default useModels
