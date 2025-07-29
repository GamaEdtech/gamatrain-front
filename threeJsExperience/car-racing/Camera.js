import { PerspectiveCamera, MathUtils } from 'three'
import Experience from './Experience.js'

// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

export default class Camera {
  constructor() {
    this.experience = new Experience()
    this.sizes = this.experience.sizes
    this.scene = this.experience.scene
    this.canvas = this.experience.canvas
    this.time = this.experience.time
    this.debug = this.experience.debug
    this.options = this.experience.options

    this.positionY = this.options.cameraYPosition
    this.positionX = this.options.offsetXStart - this.options.distanceCameraFromCar
    this.speed = this.options.carBaseSpeed
    this.positionMiddleRoad = this.options.mountainWidth + (this.options.groundWidth / 2)
    this.smoothX = null

    this.cameraMode = 'default'

    // window.addEventListener("keydown", (event) => {
    //     if (event.key == "ArrowUp") {
    //         this.positionX += this.speed
    //         const z = this.calculatePositionZ(this.positionX);
    //         this.instance.position.set(this.positionX, this.positionY, z)
    //         this.instance.lookAt(this.positionX + this.options.distanceLookAtCamera, this.positionY, this.calculatePositionZ(this.positionX + this.options.distanceLookAtCamera))
    //     } else if (event.key == "ArrowDown") {
    //         this.positionX -= this.speed
    //         const z = this.calculatePositionZ(this.positionX);
    //         this.instance.position.set(this.positionX, this.positionY, z)
    //         this.instance.lookAt(this.positionX + this.options.distanceLookAtCamera, this.positionY, this.calculatePositionZ(this.positionX + this.options.distanceLookAtCamera))
    //     }
    // })

    this.setInstance()
    this.setControls()

    if (this.debug) {
      this.setDebug()
    }
  }

  calculatePositionZ(positionx) {
    return Math.cos(positionx * this.options.roadFrequencyX) * this.options.roadAmplitudeX + this.positionMiddleRoad
  }

  setInstance() {
    this.instance = new PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 70)
    // this.instance = new PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 1000)

    this.instance.position.set(this.positionX, this.positionY, this.calculatePositionZ(this.positionX))

    this.scene.add(this.instance)
  }

  setControls() {
    // this.controls = new OrbitControls(this.instance, this.canvas)
    // this.controls.enableDamping = true
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height
    this.instance.updateProjectionMatrix()
  }

  setDebug() {
    const CameraFolder = this.debug.ui.addFolder('Camera')
    CameraFolder.add(this.instance.position, 'x').name('x Camera').min(-100).max(200).step(1)
    CameraFolder.add(this.instance.position, 'y').name('y Camera').min(-100).max(200).step(1)
    CameraFolder.add(this.instance.position, 'z').name('z Camera').min(-100).max(200).step(1)
  }

  update() {
    // this.controls.update()

    if (this.cameraMode == 'default') {
      this.positionX = this.experience.world.car.positionX - this.options.distanceCameraFromCar

      if (this.smoothX === null) this.smoothX = this.positionX
      this.smoothX = MathUtils.lerp(this.smoothX, this.positionX, 0.1)
      this.instance.position.set(this.smoothX, this.positionY, this.calculatePositionZ(this.smoothX))
      this.instance.lookAt(this.smoothX + this.options.distanceLookAtCamera, this.positionY, this.calculatePositionZ(this.smoothX + this.options.distanceLookAtCamera))

      // // position from top
      //            // this.instance.position.set(this.smoothX, this.positionY + 5, this.calculatePositionZ(this.smoothX))
      //            // this.instance.lookAt(this.smoothX + this.options.distanceLookAtCamera, this.positionY, this.calculatePositionZ(this.smoothX + this.options.distanceLookAtCamera))

      const targetFov = 75 + this.options.carBaseSpeed * 0.5
      this.instance.fov = MathUtils.lerp(this.instance.fov, targetFov, 0.1)
    }
    else {
      this.positionX = this.experience.world.car.positionX - 0.85

      if (this.smoothX === null) this.smoothX = this.positionX
      this.smoothX = MathUtils.lerp(this.smoothX, this.positionX, 0.1)
      this.instance.position.set(this.smoothX, 2, this.experience.world.car.mesh.position.z)
      this.instance.lookAt(this.smoothX + 15, 1, this.calculatePositionZ(this.smoothX + 15))

      const targetFov = 100 + this.options.carBaseSpeed * 0.5
      this.instance.fov = MathUtils.lerp(this.instance.fov, targetFov, 0.1)
    }

    this.instance.updateProjectionMatrix()
  }
}
