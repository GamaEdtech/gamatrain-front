// composables/useThreejs.ts
import * as THREE from 'three'
import { ref, shallowRef, type Ref } from 'vue'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

export function useThreeJS() {
  // Scene elements
  const scene = shallowRef(new THREE.Scene())
  const camera = shallowRef(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000))
  const renderer = shallowRef<THREE.WebGLRenderer | null>(null)

  // State
  const animationFrameId = ref<number | null>(null)

  /**
     * Sets up the Three.js scene with renderer and lighting
     */
  const setupScene = (container: HTMLDivElement, modelesLoaded: Ref<boolean>) => {
    // Configure scene with a slightly somber atmosphere
    scene.value.background = new THREE.Color(0x0b1220) // A bit brighter but still moody blue
    scene.value.fog = new THREE.FogExp2(0x0c1323, 0.001) // Lighter fog, less dense

    // Initialize renderer
    initializeRenderer(container)

    // Add lighting to the scene
    addLights(modelesLoaded)

    // Handle window resize
    window.addEventListener('resize', onWindowResize)
  }

  /**
     * Initializes and configures the WebGL renderer
     */
  const initializeRenderer = (container: HTMLDivElement) => {
    renderer.value = new THREE.WebGLRenderer({
      antialias: false,
      powerPreference: 'high-performance',
    })
    renderer.value.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.value.setSize(window.innerWidth, window.innerHeight)
    renderer.value.outputColorSpace = THREE.SRGBColorSpace

    // Enable shadows for mood
    renderer.value.shadowMap.enabled = false
    // renderer.value.shadowMap.type = THREE.PCFSoftShadowMap

    // Brighter but still moody tone mapping
    renderer.value.toneMapping = THREE.ACESFilmicToneMapping
    renderer.value.toneMappingExposure = 1.1 // Increased exposure for brightness

    container.appendChild(renderer.value.domElement)
  }

  /**
     * Adds moderately somber lighting to the scene
     */
  const addLights = (modelesLoaded: Ref<boolean>) => {
    // Ambient light - brighter but still cool-toned for mood
    const ambientLight = new THREE.AmbientLight(0x8090a5, 0.7)
    scene.value.add(ambientLight)

    // Main light source - brighter but still cool-toned
    const mainLight = new THREE.DirectionalLight(0xb0c0d5, 0.8)
    mainLight.position.set(30, 100, 20)
    mainLight.castShadow = true
    mainLight.shadow.mapSize.width = 2048
    mainLight.shadow.mapSize.height = 2048
    mainLight.shadow.camera.far = 500
    mainLight.shadow.bias = -0.0005
    scene.value.add(mainLight)

    // Fill light for better visibility
    const fillLight = new THREE.DirectionalLight(0x5d6e87, 0.4)
    fillLight.position.set(-50, 40, -30)
    scene.value.add(fillLight)

    // Warm interior lights
    const interiorLight1 = new THREE.PointLight(0xffaa55, 1.0, 120)
    interiorLight1.position.set(-20, 25, 50)
    scene.value.add(interiorLight1)

    const interiorLight2 = new THREE.PointLight(0xffaa55, 0.8, 100)
    interiorLight2.position.set(25, 20, -30)
    scene.value.add(interiorLight2)

    // Additional visibility light
    const visibilityLight = new THREE.HemisphereLight(0x606c84, 0x2a303c, 0.5)
    scene.value.add(visibilityLight)

    // Flickering animation - more subtle
    const flickerLights = () => {
      if (!modelesLoaded) return

      // Subtle random intensity fluctuation
      interiorLight1.intensity = 1.0 + Math.random() * 0.1
      interiorLight2.intensity = 0.8 + Math.random() * 0.1

      // Continue flickering
      setTimeout(flickerLights, 150 + Math.random() * 250)
    }

    // Start flickering when model is loaded
    setTimeout(() => {
      if (modelesLoaded) flickerLights()
    }, 2000)
  }

  /**
     * Loads the castle model from GLB file
     */
  // const loadModel = (url: string): Promise<{ model: THREE.Group<THREE.Object3DEventMap>, scene: THREE.Scene }> => {
  //     return new Promise<{ model: THREE.Group<THREE.Object3DEventMap> , scene: THREE.Scene}>((resolve, reject) => {
  //         const loader = new GLTFLoader()

  //         loader.load(url, (gltf) => {
  //             const model = gltf.scene

  //             // scene.value.add(model)
  //             console.log(scene.value);

  //             modelLoaded.value = true
  //             resolve({model, scene: scene.value})
  //         }, undefined, (error) => {
  //             reject(error)
  //         })

  //     })
  // }

  const loadModel = async (url: string): Promise<GLTF> => {
    const loader = new GLTFLoader()
    const gltf = await loader.loadAsync(url)
    const model = gltf

    console.log(model)

    return model
  }

  /**
     * Starts the main rendering animation loop
     */
  const startAnimationLoop = (callback?: () => void) => {
    const animate = () => {
      if (callback) callback()
      if (renderer.value) {
        renderer.value.render(scene.value, camera.value)
      }
      animationFrameId.value = requestAnimationFrame(animate)
    }
    animate()
  }

  /**
     * Handles window resize events
     */
  const onWindowResize = () => {
    if (renderer.value) {
      camera.value.aspect = window.innerWidth / window.innerHeight
      camera.value.updateProjectionMatrix()
      renderer.value.setSize(window.innerWidth, window.innerHeight)
    }
  }

  /**
     * Cleans up resources when component is unmounted
     */
  const cleanup = () => {
    if (animationFrameId.value !== null) {
      cancelAnimationFrame(animationFrameId.value)
    }
    window.removeEventListener('resize', onWindowResize)
  }

  return {
    scene,
    camera,
    renderer,
    setupScene,
    loadModel,
    startAnimationLoop,
    cleanup,
  }
}
