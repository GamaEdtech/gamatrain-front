import {
  SRGBColorSpace,
  MeshBasicMaterial,
  InstancedMesh,
  DynamicDrawUsage,
  Object3D,
} from 'three'
import Experience from '../Experience.js'

export default class Clouds {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.time = this.experience.time
    this.debug = this.experience.debug
    this.options = this.experience.options
    this.resources = this.experience.resources

    this.cloudCount = this.options.cloudCount

    // // floating animation clouds
    // this.floatSpeed = 0.5
    // this.floatHeight = 0.5
    // this.positions = []
    // this.offsets = []

    this.setGeometry()
    this.setMaterial()
    this.setMesh()

    if (this.debug) {
      this.setDebug()
    }
  }

  setGeometry() {
    this.gltgModel = this.resources.items.cloudGLTFModel.scene
    this.geometry = this.gltgModel.children.find(
      child => child.isMesh,
    ).geometry
  }

  setMaterial() {
    this.resources.items.cloudBakedTexture.flipY = false
    this.resources.items.cloudBakedTexture.colorSpace = SRGBColorSpace
    this.material = new MeshBasicMaterial({
      map: this.resources.items.cloudBakedTexture,
    })
  }

  setMesh() {
    this.meshes = new InstancedMesh(
      this.geometry,
      this.material,
      this.cloudCount,
    )
    this.meshes.instanceMatrix.setUsage(DynamicDrawUsage)
    this.dummy = new Object3D()

    for (let i = 0; i < this.cloudCount; i++) {
      const x = Math.random() * this.options.roadSize
      const y = 10 + Math.random() * 4
      const z
        = i < this.cloudCount / 2
          ? Math.random() * this.options.mountainWidth
          : this.options.mountainWidth
            + this.options.groundWidth
            + Math.random() * this.options.mountainWidth

      const scale = 0.02 + Math.random() * 0.1

      // // floating animation clouds
      // this.positions.push({ x, y, z, scale })
      // this.offsets.push(Math.random() * Math.PI * 2)

      this.dummy.position.set(x, y, z)
      this.dummy.rotation.set(0, Math.random() * Math.PI * 2, 0)
      this.dummy.scale.set(scale, scale, scale)
      this.dummy.updateMatrix()
      this.meshes.setMatrixAt(i, this.dummy.matrix)
    }

    this.meshes.instanceMatrix.needsUpdate = true
    this.scene.add(this.meshes)
  }

  update() {
    // // floating animation clouds
    // const time = this.time.elapsedTime
    // for (let i = 0; i < this.totalClouds; i++) {
    //     const pos = this.positions[i]
    //     const offset = this.offsets[i]
    //     const floatY = pos.y + Math.sin(time * this.floatSpeed + offset) * this.floatHeight
    //     this.dummy.position.set(pos.x, floatY, pos.z)
    //     this.dummy.scale.set(pos.scale, pos.scale, pos.scale)
    //     this.dummy.rotation.set(0, offset, 0)
    //     this.dummy.updateMatrix()
    //     this.meshes.setMatrixAt(i, this.dummy.matrix)
    // }
    // this.meshes.instanceMatrix.needsUpdate = true
  }

  setDebug() {}
}
