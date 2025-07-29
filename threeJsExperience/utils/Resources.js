import { TextureLoader, CubeTextureLoader } from 'three'
import EventEmitter from './EventEmitter.js'

export default class Resources extends EventEmitter {
  constructor(sources) {
    super()

    this.sources = sources

    this.items = {}
    this.toLoad = this.sources.length
    this.loaded = 0

    this.setLoaders().then(() => {
      this.startLoading()
    })
  }

  async setLoaders() {
    this.loaders = {}
    this.loaders.textureLoader = new TextureLoader()
    this.loaders.cubeTextureLoader = new CubeTextureLoader()

    if (import.meta.client) {
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js')
      const { FontLoader } = await import('three/examples/jsm/loaders/FontLoader.js')
      const { TextGeometry } = await import('three/examples/jsm/geometries/TextGeometry.js')
      const module = await import('three-custom-shader-material/vanilla')

      this.loaders.gltfLoader = new GLTFLoader()
      this.loaders.fontLoader = new FontLoader()

      this.items.TextGeometry = TextGeometry
      this.items.CustomShaderMaterial = module.default
    }
  }

  startLoading() {
    // Load each source
    for (const source of this.sources) {
      if (source.type === 'gltfModel') {
        this.loaders.gltfLoader.load(
          source.path,
          (file) => {
            this.sourceLoaded(source, file)
          },
        )
      }
      else if (source.type === 'texture') {
        this.loaders.textureLoader.load(
          source.path,
          (file) => {
            this.sourceLoaded(source, file)
          },
        )
      }
      else if (source.type === 'cubeTexture') {
        this.loaders.cubeTextureLoader.load(
          source.path,
          (file) => {
            this.sourceLoaded(source, file)
          },
        )
      }
      else if (source.type === 'font') {
        this.loaders.fontLoader.load(
          source.path,
          (file) => {
            this.sourceLoaded(source, file)
          },
        )
      }
    }
  }

  sourceLoaded(source, file) {
    this.items[source.name] = file

    this.loaded++

    if (this.loaded === this.toLoad) {
      this.trigger('ready')
    }
  }
}
