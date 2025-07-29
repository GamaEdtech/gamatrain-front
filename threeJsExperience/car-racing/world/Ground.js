import { PlaneGeometry, MeshStandardMaterial, Mesh, Color } from 'three'
import Experience from '../Experience.js'

export default class Ground {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.time = this.experience.time
    this.debug = this.experience.debug
    this.options = this.experience.options

    this.groundColor = this.options.groundColor

    this.setGeometry()
    this.setMaterial()
    this.setMesh()

    if (this.debug) {
      this.setDebug()
    }
  }

  setGeometry() {
    this.geometry = new PlaneGeometry(this.options.groundSize, this.options.groundWidth)
  }

  setMaterial() {
    this.material = new MeshStandardMaterial({
      color: this.groundColor,
    })
  }

  setMesh() {
    this.mesh = new Mesh(this.geometry, this.material)
    this.mesh.rotation.x = -Math.PI / 2
    this.mesh.position.x = this.options.groundSize / 2
    this.mesh.position.z = this.options.mountainWidth + (this.options.groundWidth / 2) - 0.1
    this.scene.add(this.mesh)
  }

  update() {
  }

  setDebug() {
    const GroundFolder = this.debug.ui.addFolder('Ground')
    GroundFolder.addColor(this, 'groundColor').name('ground Color').onChange((value) => {
      this.material.color = new Color(value)
    })
    // GroundFolder.add(this.texture.repeat, "x").name("x reapet").min(1).max(100).step(1)
    // GroundFolder.add(this.texture.repeat, "y").name("y reapet").min(1).max(100).step(1)
  }
}
