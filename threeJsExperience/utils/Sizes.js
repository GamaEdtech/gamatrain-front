import EventEmitter from './EventEmitter.js'
import {
  Vector2,
} from 'three'

export default class Sizes extends EventEmitter {
  constructor() {
    super()

    // Setup
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.pixelRatio = Math.min(window.devicePixelRatio, 2)
    this.resolution = new Vector2(this.width * this.pixelRatio, this.height * this.pixelRatio)

    // Resize event
    window.addEventListener('resize', () => {
      this.width = window.innerWidth
      this.height = window.innerHeight
      this.pixelRatio = Math.min(window.devicePixelRatio, 2)
      this.resolution.set(this.width * this.pixelRatio, this.height * this.pixelRatio)

      this.trigger('resize')
    })
  }
}
