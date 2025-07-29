import * as THREE from 'three'

const createGround = (scene: THREE.Scene) => {
  const groundMesh = new THREE.Mesh(
    new THREE.BoxGeometry(1500, 3, 1500), // 15x bigger
    new THREE.MeshStandardMaterial({ color: 0x888888, transparent: true, opacity: 0 }),
  )
  groundMesh.position.set(0, -1.5, 0) // 15x bigger
  scene.add(groundMesh)
  return groundMesh
}

export {
  createGround,
}
