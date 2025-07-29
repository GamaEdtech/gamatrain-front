import Experience from '../Experience.js'
import Ground from './Ground.js'
import Road from './Road.js'
import Mountain from './Mountain.js'
import Lighting from './Lighting.js'
import Clouds from './Clouds.js'
import Trees from './Trees.js'
import Car from './Car.js'
import Levels from './Levels.js'
import Gems from './Gems.js'

export default class World {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.time = this.experience.time
    this.debug = this.experience.debug

    this.lighting = new Lighting()
    this.ground = new Ground()
    this.road = new Road()
    this.mountain = new Mountain()
    this.clouds = new Clouds()
    this.trees = new Trees()
    this.car = new Car()
    this.levels = new Levels()
    this.gems = new Gems()
  }

  update() {
    this.car.update()
    this.gems.update()
    // this.levels.update()
    // this.clouds.update()
  }
}
