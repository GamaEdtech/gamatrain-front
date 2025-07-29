import EventEmitter from './EventEmitter.js'
import { Clock } from 'three'

export default class Time extends EventEmitter {
  constructor() {
    super()

    // Setup
    this.start = Date.now()
    this.current = this.start
    this.elapsed = 0
    this.delta = 16
    this.clock = new Clock()

    window.requestAnimationFrame(() => {
      this.tick()
    })
  }

  tick() {
    const currentTime = Date.now()
    this.delta = currentTime - this.current
    this.current = currentTime
    this.elapsed = this.current - this.start

    this.elapsedTime = this.clock.getElapsedTime()

    this.trigger('tick')

    window.requestAnimationFrame(() => {
      this.tick()
    })
  }
}
