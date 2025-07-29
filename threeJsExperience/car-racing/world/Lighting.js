import { DirectionalLight, Fog, Color } from 'three'
import Experience from '../Experience.js'

export default class Lighting {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.time = this.experience.time
    this.debug = this.experience.debug
    this.options = this.experience.options

    this.setDirectioanlLight()
    this.setFog()

    if (this.debug) {
      this.setDebug()
    }
  }

  setDirectioanlLight() {
    this.directionalLight = new DirectionalLight('#ffffff', 5)
    this.directionalLight.position.set(-100, this.options.yLight, 200)

    this.directionalLight.castShadow = true
    this.directionalLight.shadow.mapSize.set(1024, 1024)
    this.directionalLight.shadow.camera.near = 0.1
    this.directionalLight.shadow.camera.far = 30
    this.directionalLight.shadow.camera.top = 8
    this.directionalLight.shadow.camera.right = 8
    this.directionalLight.shadow.camera.bottom = -8
    this.directionalLight.shadow.camera.left = -8
    this.scene.add(this.directionalLight)
    // this.helper = new THREE.DirectionalLightHelper(this.directionalLight, 5);
    // this.scene.add(this.helper);
  }

  setFog() {
    this.scene.fog = new Fog(
      this.options.fogColor,
      this.options.near,
      this.options.far,
    )
  }

  update() {
  }

  setDebug() {
    const LightFolder = this.debug.ui.addFolder('Light')
    LightFolder.add(this.directionalLight.position, 'x').min(-100).max(200).step(1).name('x light')
    LightFolder.add(this.directionalLight.position, 'y').min(-100).max(400).step(1).name('y light')
    LightFolder.add(this.directionalLight.position, 'z').min(-100).max(200).step(1).name('z light')

    const FogFolder = this.debug.ui.addFolder('fog')
    FogFolder.addColor(this.options, 'fogColor').name('color fog').onChange(() => {
      this.scene.fog.color = new Color(this.options.fogColor)
    })

    FogFolder.add(this.options, 'near').min(0).max(200).step(0.1).name('near fog').onChange(() => {
      this.scene.fog.near = this.options.near
    })

    FogFolder.add(this.options, 'far').min(0).max(200).step(0.1).name('far fog').onChange(() => {
      this.scene.fog.far = this.options.far
    })
  }
}
