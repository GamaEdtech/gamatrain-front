import { Color, MeshBasicMaterial, Mesh } from 'three'
import Experience from '../Experience.js'

export default class Levels {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.time = this.experience.time
    this.debug = this.experience.debug
    this.options = this.experience.options

    this.laneCount = this.options.countLine
    this.laneWidth = this.options.roadWidth / this.laneCount
    this.positionMiddleRoad
      = this.options.mountainWidth + this.options.groundWidth / 2
    this.questions = this.options.questions
    this.positionYNumber = 1.2
    this.configTextGeometry = {
      font: this.experience.resources.items.fontLevel,
      size: 1,
      depth: 0.2,
      curveSegments: 6,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 2,
    }
    this.predefinedColors = ['#ff4d4d', '#4da6ff', '#4dff88', '#ffff4d']
    this.floatSpeed = 2
    this.floatAmplitude = 0.2

    this.TextGeometry = this.experience.resources.items.TextGeometry
    this.setMaterial()

    this.meshes = []
    this.loadedQuestions = []
    this.loadQuestions(0, 2)

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

  getRotation(positionX, currentLane) {
    const deltaX = 0.1
    const currentZ = this.getFinalZ(positionX, currentLane)
    const nextZ = this.getFinalZ(positionX - deltaX, currentLane)

    const dz = nextZ - currentZ
    const angle = Math.atan2(dz, deltaX)

    return angle + (3 * Math.PI) / 2
  }

  getRandomColor() {
    const hue = Math.floor(Math.random() * 360)
    return new Color(`hsl(${hue}, 100%, 50%)`)
  }

  setMaterial() {
    this.materials = this.predefinedColors.map(
      color => new MeshBasicMaterial({ color }),
    )
  }

  createMeshForQuestion(index) {
    const question = this.questions[index]
    if (!question) return

    const positionX = this.options.questionsPositionX[index]
    question.choices.forEach((text, jIndex) => {
      const geometry = new this.TextGeometry(text, this.configTextGeometry)
      geometry.center()

      const material
        = this.materials[Math.floor(Math.random() * this.materials.length)]
      const mesh = new Mesh(geometry, material)

      const laneNumber = jIndex + 1
      const posZ = this.getFinalZ(positionX, laneNumber)

      mesh.position.set(positionX, this.positionYNumber, posZ)
      mesh.rotation.y = this.getRotation(positionX, laneNumber)

      mesh.userData.floatOffset = Math.random() * Math.PI * 2

      this.scene.add(mesh)
      this.meshes.push(mesh)
    })
  }

  loadQuestions(from, to) {
    for (let i = from; i <= to && i < this.questions.length; i++) {
      if (!this.loadedQuestions.includes(i)) {
        this.createMeshForQuestion(i)
        this.loadedQuestions.push(i)
      }
    }
  }

  updateQuestions(currentQuestionIndex) {
    if (currentQuestionIndex % 3 === 1) {
      const from = currentQuestionIndex + 2
      const to = from + 2
      this.loadQuestions(from, to)
    }
  }

  update() {
    const time = this.time.elapsed * 0.001
    this.meshes.forEach((mesh) => {
      mesh.position.y
        = this.positionYNumber
          + Math.sin(time * this.floatSpeed + mesh.userData.floatOffset)
          * this.floatAmplitude
    })
  }

  setDebug() {}
}
