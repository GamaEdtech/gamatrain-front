import { ref } from 'vue'
import * as THREE from 'three'
import * as CANNON from 'cannon-es'

interface CoinData {
  mesh: THREE.Mesh
  body: CANNON.Body
}

export const usePhysics = (scene: THREE.Scene) => {
  const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -163.3, 0) }) // 15x bigger gravity
  const coins = ref<CoinData[]>([])
  const coinBodies = ref<CANNON.Body[]>([])
  const clock = new THREE.Clock()

  let lastTime = 0
  const targetFPS = 60
  const frameTime = 1 / targetFPS

  const createVisibleRoom = () => {
    const wallMaterial = new CANNON.Material('wall')
    const wallThickness = 1.5
    const roomWidth = 750
    const roomDepth = 750
    const wallHeight = 100

    const wallColor = 0x00ffff
    const wallOpacity = 0.2
    const _meshMaterial = new THREE.MeshStandardMaterial({
      color: wallColor,
      transparent: true,
      opacity: wallOpacity,
      side: THREE.DoubleSide,
    })

    const walls = [
      {
        size: [roomWidth * 2, wallHeight * 2, wallThickness * 2],
        position: [0, -10, 491],
      },
      {
        size: [roomWidth * 2, wallHeight * 2, wallThickness * 2],
        position: [0, -10, 248.58],
      },
      {
        size: [roomWidth * 2, wallHeight * 2, wallThickness * 2],
        position: [0, -10, 0],
      },
      {
        size: [roomWidth * 2, wallHeight * 2, wallThickness * 2],
        position: [0, -10, -244.78],
      },
      {
        size: [roomWidth * 2, wallHeight * 2, wallThickness * 2],
        position: [0, -10, -487],
      },
      {
        size: [wallThickness * 2, wallHeight * 2, roomDepth * 2],
        position: [-90, -10, 0],
      },
      {
        size: [wallThickness * 2, wallHeight * 2, roomDepth * 2],
        position: [77, -10, 0],
      },
    ]

    walls.forEach(({ size, position }) => {
      const [w, h, d] = size
      const [x, y, z] = position

      // فیزیکی
      const shape = new CANNON.Box(new CANNON.Vec3(w / 2, h / 2, d / 2))
      const body = new CANNON.Body({ mass: 0, material: wallMaterial })
      body.addShape(shape)
      body.position.set(x, y, z)
      world.addBody(body)

      // // گرافیکی
      // const geometry = new THREE.BoxGeometry(w, h, d)
      // const mesh = new THREE.Mesh(geometry, meshMaterial)
      // mesh.position.set(x, y, z)
      // scene.add(mesh)
    })
  }

  const initPhysics = () => {
    // Optimize physics world
    world.broadphase = new CANNON.SAPBroadphase(world)
    world.defaultContactMaterial.friction = 0.3
    world.defaultContactMaterial.restitution = 0.7

    if ('iterations' in world.solver) {
      (world.solver as { iterations: number }).iterations = 5
    }
    world.allowSleep = true

    // Create ground physics body (15x bigger)
    const groundMaterial = new CANNON.Material('ground')
    const groundShape = new CANNON.Box(new CANNON.Vec3(750, 1.5, 750)) // 15x bigger
    const groundBody = new CANNON.Body({ mass: 0, material: groundMaterial })
    groundBody.addShape(groundShape)
    groundBody.position.set(0, -1.5, 0) // 15x bigger
    world.addBody(groundBody)

    createVisibleRoom()
  }

  const throwCoins = (
    boxSize: { x: number, y: number, z: number },
    side: 'left' | 'right',
    count: number = 70,
  ) => {
    // Create coin geometry and material (15x bigger)
    const coinGeometry = new THREE.CylinderGeometry(2.25, 2.25, 0.45, 16) // 15x bigger
    const coinMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.6,
      roughness: 0.2,
    })

    const coinShape = new CANNON.Cylinder(1.75, 1.75, 0.45, 8) // 15x bigger

    for (let i = 0; i < count; i++) {
      // Create visual mesh
      const coinMesh = new THREE.Mesh(coinGeometry, coinMaterial)
      scene.add(coinMesh)

      // Create physics body
      const body = new CANNON.Body({
        mass: 4.5, // 15x bigger mass
        shape: coinShape,
        material: new CANNON.Material('coin'),
      })

      // Set initial position (15x bigger)
      const x = (Math.random() - 0.5) * 12 + boxSize.x // 15x bigger spread
      const y = boxSize.y + Math.random() * 7.5 // 15x bigger
      const z = (Math.random() - 0.5) * 12 + boxSize.z // 15x bigger spread

      console.log('x', x, 'y', y, 'z', z)
      body.position.set(x, y, z)

      // console.log('boxSize', boxSize);

      // Set forward velocity (15x bigger)
      const forwardSpeed = 20 + Math.random() * 60 // 15x bigger speed
      const sidewaysSpread = (Math.random() - 0.5) * 60 // 15x bigger spread
      const upwardVelocity = 75 + Math.random() * 45 // 15x bigger upward velocity

      console.log('side', side)
      body.velocity.set(
        side === 'left' ? forwardSpeed : -forwardSpeed,
        upwardVelocity,
        sidewaysSpread,
      )

      // Add rotation
      body.angularVelocity.set(
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
      )

      world.addBody(body)
      coinBodies.value.push(body)
      coins.value.push({ mesh: coinMesh, body })
    }
  }

  const updatePhysics = (boxSize: { x: number, y: number, z: number }) => {
    const currentTime = clock.getElapsedTime()
    const deltaTime = currentTime - lastTime

    if (deltaTime >= frameTime) {
      world.step(frameTime, deltaTime, 2)

      // Update coin positions
      for (let i = 0; i < coins.value.length; i++) {
        const { mesh, body } = coins.value[i]
        mesh.position.copy(body.position as THREE.Vector3)
        mesh.quaternion.copy(body.quaternion as THREE.Quaternion)

        // Reset coins that go too far (15x bigger bounds)
        if (body.position.y < -75 || body.position.z < -450) {
          body.position.set(
            (Math.random() - 0.5) * 12,
            boxSize.y + Math.random() * 7.5,
            (Math.random() - 0.5) * 12,
          )
          const forwardSpeed = 120 + Math.random() * 60
          const sidewaysSpread = (Math.random() - 0.5) * 30
          const upwardVelocity = 75 + Math.random() * 45
          body.velocity.set(sidewaysSpread, upwardVelocity, -forwardSpeed)
        }
      }

      lastTime = currentTime
    }
  }

  const clearCoins = () => {
    console.log('Clearing coins. Current count:', coins.value.length)
    console.log('Scene children before cleanup:', scene.children.length)

    // Create a copy of the arrays to iterate over
    const coinsToRemove = [...coins.value]

    // Remove meshes from scene and dispose resources
    coinsToRemove.forEach(({ mesh, body }, index) => {
      console.log(`Removing coin ${index}:`, mesh.uuid)

      // Check if mesh is actually in the scene
      const meshInScene = scene.children.includes(mesh)
      console.log(`Mesh ${index} in scene:`, meshInScene)

      // Try multiple removal methods
      if (meshInScene) {
        scene.remove(mesh)
        console.log(`Removed mesh ${index} from scene`)
      }

      // Alternative: Remove by traversing and finding the mesh
      if (scene.children.includes(mesh)) {
        const index = scene.children.indexOf(mesh)
        if (index > -1) {
          scene.children.splice(index, 1)
          console.log(`Force removed mesh at index ${index}`)
        }
      }

      // Dispose geometry and materials
      if (mesh.geometry) {
        mesh.geometry.dispose()
      }

      if (mesh.material) {
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(mat => mat.dispose())
        }
        else {
          mesh.material.dispose()
        }
      }

      // Remove from physics world
      try {
        world.removeBody(body)
      }
      catch (error) {
        console.warn('Error removing body from physics world:', error)
      }
    })

    // Alternative approach: Remove all cylinder geometries from scene
    const childrenToRemove: THREE.Mesh[] = []
    scene.traverse((child) => {
      if (
        child instanceof THREE.Mesh
        && child.geometry instanceof THREE.CylinderGeometry
      ) {
        childrenToRemove.push(child)
      }
    })

    console.log('Found cylinder meshes to remove:', childrenToRemove.length)
    childrenToRemove.forEach((mesh, index) => {
      scene.remove(mesh)
      console.log(`Removed cylinder mesh ${index}`)

      // Dispose resources
      if (mesh.geometry) {
        mesh.geometry.dispose()
      }
      if (mesh.material) {
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat: THREE.Material) => mat.dispose())
        }
        else {
          mesh.material.dispose()
        }
      }
    })

    // Clear the reactive arrays
    coins.value.length = 0
    coinBodies.value.length = 0

    console.log('Coins cleared. Remaining count:', coins.value.length)
    console.log('Scene children after cleanup:', scene.children.length)

    // Check for remaining coin-like meshes
    const remainingMeshes = scene.children.filter(
      child =>
        child instanceof THREE.Mesh
        && child.geometry instanceof THREE.CylinderGeometry,
    )
    console.log('Remaining coin-like meshes:', remainingMeshes.length)

    // Force Vue reactivity update
    coins.value = []
    coinBodies.value = []
  }

  const cleanup = () => {
    clearCoins()
  }

  return {
    world,
    coins,
    initPhysics,
    throwCoins,
    clearCoins,
    updatePhysics,
    cleanup,
  }
}
