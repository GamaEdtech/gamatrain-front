import {
  InstancedMesh,
  Object3D,
  DynamicDrawUsage,
  MeshBasicMaterial,
  BufferGeometry,
  Float32BufferAttribute,
  ShaderMaterial,
  Points,
  Vector3,
  Uniform,
  AdditiveBlending,
  Spherical,
  Color,
} from 'three'
import Experience from '../Experience.js'
import vertex from '../shaders/firework/vertex.glsl'
import fragment from '../shaders/firework/fragment.glsl'

export default class Gems {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.time = this.experience.time
    this.debug = this.experience.debug
    this.options = this.experience.options
    this.resources = this.experience.resources

    this.gemCount = this.options.gemCount
    this.laneCount = this.options.countLine
    this.laneWidth = this.options.roadWidth / this.laneCount
    this.positionMiddleRoad
      = this.options.mountainWidth + this.options.groundWidth / 2
    this.gemsInformation = this.options.gemsInformation

    this.fireWorks = []

    this.setGeometry()
    this.setMaterial()
    this.setMesh()

    if (this.debug) {
      this.setDebug()
    }
  }

  getLaneZOffset(laneNumber) {
    const center = (this.laneCount + 1) / 2
    return -((center - laneNumber) * this.laneWidth) + this.positionMiddleRoad
  }

  getRoadZOffset(positionX) {
    return (
      Math.cos(positionX * this.options.roadFrequencyX)
      * this.options.roadAmplitudeX
    )
  }

  getFinalZ(positionX, currentLane) {
    return this.getRoadZOffset(positionX) + this.getLaneZOffset(currentLane)
  }

  onGemColocted(gemIndex) {
    const dummy = new Object3D()
    dummy.position.set(0, -9999, 0)
    dummy.scale.set(0, 0, 0)
    dummy.updateMatrix()
    this.instanceMesh.setMatrixAt(gemIndex, dummy.matrix)
    this.instanceMesh.instanceMatrix.needsUpdate = true

    const z = this.getFinalZ(
      this.gemsInformation[gemIndex].x,
      this.gemsInformation[gemIndex].lane,
    )
    this.createRandomFireWork(
      new Vector3(this.gemsInformation[gemIndex].x, 1, z),
    )
  }

  passGem(gemIndex) {
    const dummy = new Object3D()
    dummy.position.set(0, -9999, 0)
    dummy.scale.set(0, 0, 0)
    dummy.updateMatrix()
    this.instanceMesh.setMatrixAt(gemIndex, dummy.matrix)
    this.instanceMesh.instanceMatrix.needsUpdate = true
  }

  createRandomFireWork(position) {
    const count = Math.round(200 + Math.random() * 100)
    const size = 0.5 + Math.random() * 0.1
    const radius = 1 + Math.random() * 0.5
    const color = new Color()
    color.setHSL(Math.random(), 1, 0.5)
    this.createFireWork(count, position, size, radius, color)
  }

  createFireWork(countPoint, position, size, radius, color) {
    const count = countPoint

    const positionArrays = new Float32Array(count * 3)
    const sizesArray = new Float32Array(count)
    const timeMultipliersArray = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3

      const spherical = new Spherical(
        radius * (Math.random() * 0.25 + 0.75),
        Math.random() * Math.PI,
        Math.random() * Math.PI * 2,
      )
      const position = new Vector3()
      position.setFromSpherical(spherical)

      positionArrays[i3] = position.x
      positionArrays[i3 + 1] = position.y
      positionArrays[i3 + 2] = position.z

      sizesArray[i] = Math.random()
      timeMultipliersArray[i] = 1 + Math.random()
    }

    const geometryFireWork = new BufferGeometry()
    geometryFireWork.setAttribute(
      'position',
      new Float32BufferAttribute(positionArrays, 3),
    )
    geometryFireWork.setAttribute(
      'aSize',
      new Float32BufferAttribute(sizesArray, 1),
    )
    geometryFireWork.setAttribute(
      'aTimeMultiplier',
      new Float32BufferAttribute(timeMultipliersArray, 1),
    )

    this.resources.items.starParticleTexture.flipY = false
    const materialFireWork = new ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        uSize: new Uniform(size),
        uResolution: new Uniform(this.experience.sizes.resolution),
        uTexture: new Uniform(this.resources.items.starParticleTexture),
        uColor: new Uniform(color),
        uProgress: new Uniform(0),
      },
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    })

    const fireWork = new Points(geometryFireWork, materialFireWork)
    fireWork.position.copy(position)
    this.scene.add(fireWork)

    this.fireWorks.push({
      mesh: fireWork,
      material: materialFireWork,
      startTime: this.time.elapsed,
    })
  }

  reset() {
    if (this.instanceMesh) {
      this.scene.remove(this.instanceMesh)
      this.instanceMesh.geometry.dispose()
      this.instanceMesh.material.dispose()
      this.instanceMesh = null
    }

    this.gemsInformation = this.options.gemsInformation
    this.setMesh()
  }

  setGeometry() {
    this.gltfModel = this.resources.items.gemGLTFModel.scene
    this.gemMesh = this.gltfModel.children.find(c => c.isMesh)
    this.gemGeometry = this.gemMesh.geometry
  }

  setMaterial() {
    this.resources.items.gemTexture.flipY = false
    this.gemMaterial = new MeshBasicMaterial({
      map: this.resources.items.gemTexture,
    })
  }

  setMesh() {
    this.instanceMesh = new InstancedMesh(
      this.gemGeometry,
      this.gemMaterial,
      this.gemCount,
    )
    this.instanceMesh.instanceMatrix.setUsage(DynamicDrawUsage)
    const dummy = new Object3D()

    for (let i = 0; i < this.gemCount; i++) {
      const x = this.gemsInformation[i].x
      const lane = this.gemsInformation[i].lane
      const z = this.getFinalZ(x, lane)
      dummy.position.set(x, 0.8, z)
      dummy.rotation.x = -Math.PI / 2
      dummy.scale.set(0.02, 0.02, 0.02)
      dummy.updateMatrix()
      this.instanceMesh.setMatrixAt(i, dummy.matrix)
    }

    this.scene.add(this.instanceMesh)
  }

  update() {
    this.fireWorks = this.fireWorks.filter((fireWork) => {
      const elapsed = this.time.elapsed - fireWork.startTime
      const progress = Math.min(elapsed / 3000, 1)
      fireWork.material.uniforms.uProgress.value = progress

      if (progress >= 1) {
        this.scene.remove(fireWork.mesh)
        fireWork.mesh.geometry.dispose()
        fireWork.material.dispose()
        return false
      }

      return true
    })
  }

  setDebug() {}
}
