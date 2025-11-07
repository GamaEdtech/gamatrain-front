import { useThreeJS } from '../useThreejs'
// import { doorModels } from '~/store/doorModels'
import * as THREE from 'three'
import type { DoorModels } from '~/interfaces/DoorModels.interface'

const useCastleModel = async (
  doorModels: DoorModels,
): Promise<THREE.Group<THREE.Object3DEventMap> | null> => {
  try {
    const { loadModel } = useThreeJS()
    const castleGlb = await loadModel('/game/castle/castle-v3.glb')

    const castle = castleGlb.scene

    castle.scale.set(1, 1, 1)

    castle.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        // Print mesh name and path
        let path = ''
        let current: THREE.Object3D | null = object
        while (current) {
          path = current.name + (path ? ' > ' + path : '')
          current = current.parent
        }

        if (
          ['Door.001', 'Door.002', 'Door.003', 'Door.004'].includes(
            object.material.name,
          )
        ) {
          const doorName = object.material.name.toLowerCase().replace('.', '')

          doorModels[
            doorName as 'door001' | 'door002' | 'door003' | 'door004'
          ].model = object
        }

        if (object.material.name === 'Planks.004') {
          object.position.y = -157.807
        }

        // Set up normal rendering with shadows
        object.castShadow = true
        object.receiveShadow = true

        // Slightly adjust materials for mood without making them too dark
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(adjustMaterial)
          }
          else {
            adjustMaterial(object.material)
          }
        }
      }
    })

    return castle
  }
  catch (error) {
    console.log(error)
    console.log('cant load model')
    return null
  }
}

const adjustMaterial = (material: THREE.Material) => {
  if (material instanceof THREE.MeshStandardMaterial) {
    // Slightly desaturate colors but maintain visibility
    if (material.color) {
      const color = material.color.getHSL({ h: 0, s: 0, l: 0 })
      material.color.setHSL(
        color.h,
        Math.max(0, color.s - 0.15),
        Math.max(0.2, color.l - 0.05),
      )
    }

    // Moderate roughness adjustment
    material.roughness = Math.min(0.9, material.roughness + 0.1)
  }
}

export default useCastleModel
