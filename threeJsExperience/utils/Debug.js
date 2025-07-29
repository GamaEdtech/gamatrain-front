import GUI from 'lil-gui'
import Stats from 'stats.js'

export default class Debug {
  constructor() {
    this.ui = new GUI()
    this.ui.close()
    this.stats = new Stats()
    this.stats.showPanel(0)
    document.body.appendChild(this.stats.dom)
  }

  update() {
    this.stats.begin()

    // monitored code goes here
    this.stats.end()
  }
}
