import * as THREE from 'three'

interface Position {
  x: number
  y: number
  z: number
}

function createGate(
  scene: THREE.Scene,
  position: Position = { x: -16, y: 0, z: -555 },
  size: number = 12,
  color: number = 0x3498db,
): {
  gateInteractions: (character: THREE.Object3D) => boolean
  visible: () => void
  unVisible: () => void
} {
  const INTERACTION_DISTANCE = 50
  const gate = new THREE.Vector3(-16, 55, -555)

  const gateInteractions = (character: THREE.Object3D): boolean => {
    const distanceToGate = character.position.distanceTo(gate)
    if (distanceToGate < INTERACTION_DISTANCE) {
      return true
    }
    return false
  }

  // Create the beacon group to hold all elements
  const beaconGroup = new THREE.Group()

  // Base cylinder (the main circular platform with height)
  const baseGeometry = new THREE.CylinderGeometry(size, size * 1.2, size * 0.3, 32)
  const baseMaterial = new THREE.MeshStandardMaterial({
    color: color,
    metalness: 0.5,
    roughness: 0.2,
  })
  const base = new THREE.Mesh(baseGeometry, baseMaterial)
  beaconGroup.add(base)

  // Glowing ring around the base
  const glowRingGeometry = new THREE.TorusGeometry(size * 1.2, size * 0.15, 16, 100)
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0.7,
  })
  const glowRing = new THREE.Mesh(glowRingGeometry, glowMaterial)
  glowRing.rotation.x = Math.PI / 2
  beaconGroup.add(glowRing)

  // Blinking highlight on top
  const highlightGeometry = new THREE.CircleGeometry(size * 0.8, 32)
  const highlightMaterial = new THREE.MeshBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0.9,
  })
  const highlight = new THREE.Mesh(highlightGeometry, highlightMaterial)
  highlight.position.y = size * 0.15
  highlight.rotation.x = -Math.PI / 2
  beaconGroup.add(highlight)

  // Position the entire beacon group
  beaconGroup.position.set(position.x, position.y, position.z)

  const visible = () => {
    scene.add(beaconGroup)
  }

  const unVisible = () => {
    scene.remove(beaconGroup)
  }

  visible()

  return {
    gateInteractions,
    visible,
    unVisible,
  }
}

export default createGate
