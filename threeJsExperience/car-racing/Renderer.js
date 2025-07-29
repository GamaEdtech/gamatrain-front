import { WebGLRenderer } from 'three'
import Experience from './Experience.js'

export default class Renderer {
  constructor() {
    this.experience = new Experience()
    this.canvas = this.experience.canvas
    this.sizes = this.experience.sizes
    this.scene = this.experience.scene
    this.camera = this.experience.camera.instance
    this.debug = this.experience.debug
    this.clearColor = this.experience.options.clearColor

    this.setInstance()
    if (this.debug) {
      this.setDebug()
    }
  }

  setInstance() {
    this.instance = new WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    })
    this.instance.setClearColor(this.clearColor)
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
  }

  resize() {
    this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
    this.instance.setSize(this.sizes.width, this.sizes.height)
  }

  update() {
    this.instance.render(this.scene, this.camera)
  }

  setDebug() {
    const RendererFolder = this.debug.ui.addFolder('Renderer')
    RendererFolder.addColor(this, 'clearColor').name('clear Color').onChange((value) => {
      this.instance.setClearColor(value)
    })
  }
}
