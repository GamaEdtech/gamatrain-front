import { PlaneGeometry, RepeatWrapping, MeshStandardMaterial, Uniform, Color, Mesh } from 'three'
import Experience from '../Experience.js'

import vertex from '../shaders/mountain/vertex.glsl'
import fragment from '../shaders/mountain/fragment.glsl'

export default class Mountain {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.time = this.experience.time
    this.debug = this.experience.debug
    this.options = this.experience.options

    this.CustomShaderMaterial = this.experience.resources.items.CustomShaderMaterial

    this.setGeometry()
    this.setMaterial()
    this.setMesh()

    if (this.debug) {
      this.setDebug()
    }
  }

  setGeometry() {
    this.geometry = new PlaneGeometry(this.options.mountainSize, this.options.mountainWidth, 128, 128)
    this.geometry.deleteAttribute('uv')
    this.geometry.deleteAttribute('normal')
    this.geometry.rotateX(-Math.PI / 2)
  }

  setMaterial() {
    this.noiseTexture = this.experience.resources.items.perlinNoiseTexture
    this.noiseTexture.wrapS = RepeatWrapping
    this.noiseTexture.wrapT = RepeatWrapping
    this.material = new this.CustomShaderMaterial({
      baseMaterial: MeshStandardMaterial,
      vertexShader: vertex,
      fragmentShader: fragment,
      silent: true,

      metalness: 0,
      roughness: 0.5,
      color: '#85d534',

      uniforms: {
        uPositionFrequency: new Uniform((this.options.mountainSize / 100000) + 0.015),
        // uPositionFrequency: new Uniform(this.options.positionFrequency),
        uStrength: new Uniform(this.options.strength),
        uWarpFrequency: new Uniform(this.options.warpFrequency),
        uWarpStrength: new Uniform(this.options.warpStrength),
        uColorWaterDeep: new Uniform(new Color(this.options.colorWaterDeep)),
        uColorWaterSurface: new Uniform(new Color(this.options.colorWaterSurface)),
        uColorSand: new Uniform(new Color(this.options.colorSand)),
        uColorGrass: new Uniform(new Color(this.options.colorGrass)),
        uColorSnow: new Uniform(new Color(this.options.colorSnow)),
        uColorRock: new Uniform(new Color(this.options.colorRock)),
        uPerlinTexture: new Uniform(this.noiseTexture),
      },
    })

    // shadow
    // this.despthMaterial = new CustomShaderMaterial({
    //     baseMaterial: THREE.MeshDepthMaterial,
    //     vertexShader: vertex,
    //     silent: true,

    //     depthPacking: THREE.RGBADepthPacking
    // })
  }

  setMesh() {
    this.mesh = new Mesh(this.geometry, this.material)
    this.mesh.position.set(
      this.options.mountainSize / 2,
      0,
      this.options.mountainWidth / 2,
    )

    // shadow
    // this.mesh.customDepthMaterial = this.despthMaterial
    // this.mesh.receiveShadow = true
    // this.mesh.castShadow = true

    this.scene.add(this.mesh)

    this.meshLeftMesh = new Mesh(this.geometry, this.material)
    this.meshLeftMesh.position.set(
      this.options.mountainSize / 2,
      0,
      this.options.mountainWidth + this.options.groundWidth + (this.options.mountainWidth / 2) - 1,
    )
    this.meshLeftMesh.rotation.y = Math.PI

    // shadow
    // this.mesh.customDepthMaterial = this.despthMaterial
    // this.mesh.receiveShadow = true
    // this.mesh.castShadow = true

    this.scene.add(this.meshLeftMesh)
  }

  update() {
  }

  setDebug() {
    const MountainFolder = this.debug.ui.addFolder('Mountain')
    MountainFolder.add(this.options, 'positionFrequency').min(0).max(1).step(0.001).name('position Frequency').onChange(() => {
      this.material.uniforms.uPositionFrequency.value = this.options.positionFrequency
    })
    MountainFolder.add(this.options, 'strength').min(0).max(400).step(0.001).name('strength Frequency').onChange(() => {
      this.material.uniforms.uStrength.value = this.options.strength
    })
    MountainFolder.add(this.options, 'warpFrequency').min(0).max(10).step(0.001).name('warp Frequency').onChange(() => {
      this.material.uniforms.uWarpFrequency.value = this.options.warpFrequency
    })
    MountainFolder.add(this.options, 'warpStrength').min(0).max(1).step(0.001).name('warp Strength').onChange(() => {
      this.material.uniforms.uWarpStrength.value = this.options.warpStrength
    })

    MountainFolder.addColor(this.options, 'colorWaterDeep').name('colorWaterDeep').onChange(() => {
      this.material.uniforms.uColorWaterDeep.value = new Color(this.options.colorWaterDeep)
    })

    MountainFolder.addColor(this.options, 'colorWaterSurface').name('colorWaterSurface').onChange(() => {
      this.material.uniforms.uColorWaterSurface.value = new Color(this.options.colorWaterSurface)
    })

    MountainFolder.addColor(this.options, 'colorSand').name('colorSand').onChange(() => {
      this.material.uniforms.uColorSand.value = new Color(this.options.colorSand)
    })

    MountainFolder.addColor(this.options, 'colorGrass').name('colorGrass').onChange(() => {
      this.material.uniforms.uColorGrass.value = new Color(this.options.colorGrass)
    })

    MountainFolder.addColor(this.options, 'colorSnow').name('colorSnow').onChange(() => {
      this.material.uniforms.uColorSnow.value = new Color(this.options.colorSnow)
    })
    MountainFolder.addColor(this.options, 'colorRock').name('colorRock').onChange(() => {
      this.material.uniforms.uColorRock.value = new Color(this.options.colorRock)
    })
  }
}
