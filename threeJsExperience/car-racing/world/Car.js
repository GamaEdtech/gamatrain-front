import { MathUtils } from 'three'
import Experience from '../Experience.js'

export default class Car {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.time = this.experience.time
    this.debug = this.experience.debug
    this.options = this.experience.options
    this.resourses = this.experience.resources

    this.laneCount = this.options.countLine
    this.currentLane = 1
    this.targetLane = this.currentLane
    this.laneWidth = this.options.roadWidth / this.laneCount
    this.positionX = this.options.offsetXStart
    this.speed = this.options.carBaseSpeed
    this.positionMiddleRoad = this.options.mountainWidth + (this.options.groundWidth / 2)
    this.wheelCircumference = 2 * Math.PI * 0.4
    this.laneLerpSpeed = this.options.laneLerpSpeed

    this.currentQuestionIndex = 0
    this.checkThreshold = 2
    this.questionPositions = this.options.questionsPositionX

    this.isReversing = false
    this.reverseStartX = 0
    this.reverseDistance = this.options.reverseDistanceWrongAnswer
    this.reverseSpeed = this.options.reverseSpeedWrongAnswer
    this.reverseRotationSpeed = this.options.reverseRotationSpeedWrongAnswer
    this.wrongAnswerRotationY = 0

    this.isJumping = false
    this.jumpStartY = 0.6
    this.jumpHeight = this.options.jumpHeightCorrectAnswer
    this.jumpProgress = 0
    this.jumpDuration = this.options.jumpDurationCorrectAnswer
    this.correctAnswerRotationY = 0

    this.laneChangeProgress = 0
    this.laneChangeDirection = 0
    this.isChangingLane = false

    this.isIncreaseSpeedPhase = false
    this.UpperSpeed = this.options.carBaseSpeed + 4
    this.isDecreasingPhase = false
    this.directionLastSuccessRotation = 1

    this.gemsInformation = this.options.gemsInformation
    this.gemCheckIndex = 0

    this.springCompress = 0.6
    this.bodyDrop = 0.8
    this.durationLanding = 1
    this.progressLanding = 0
    this.isLanding = false

    window.addEventListener('keydown', (event) => {
      // if (event.code === "ArrowUp") {
      //     this.moveForward()

      //     // this.jumpStartY = 0.6
      //     // this.jumpProgress = 0
      //     // this.isJumping = true
      // }
      if (event.code === 'ArrowLeft') {
        this.changeLane(-1)
      }
      else if (event.code === 'ArrowRight') {
        this.changeLane(1)
      }
      // else if (event.code === "ArrowDown") {
      //     this.moveBackward()
      // }
    })

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
    return Math.cos(positionX * this.options.roadFrequencyX) * this.options.roadAmplitudeX
  }

  getFinalZ(positionX, currentLane) {
    return this.getRoadZOffset(positionX) + this.getLaneZOffset(currentLane)
  }

  updateRotation() {
    const deltaX = 0.1
    const currentZ = this.getFinalZ(this.positionX, this.currentLane)
    const nextZ = this.getFinalZ(this.positionX - deltaX, this.currentLane)

    const dz = nextZ - currentZ
    const angle = Math.atan2(dz, deltaX)

    if (this.isChangingLane) {
      const targetProgress = Math.abs(this.targetLane - this.currentLane)
      this.laneChangeProgress = MathUtils.lerp(this.laneChangeProgress, targetProgress, 0.1)
      if (Math.abs(this.currentLane - this.targetLane) < 0.01) {
        this.currentLane = this.targetLane
        this.isChangingLane = false
        this.laneChangeProgress = 0
      }
    }

    const smoothProgress = this.laneChangeProgress * this.laneChangeProgress * (3 - 2 * this.laneChangeProgress)
    const laneTurnAngle = this.laneChangeDirection * smoothProgress * 0.75

    this.wheels.pivotFront.rotation.y = -laneTurnAngle * 0.9 + Math.PI / 2
    this.mesh.rotation.y = angle - laneTurnAngle + this.wrongAnswerRotationY + this.correctAnswerRotationY
  }

  moveForward() {
    this.positionX += this.speed
    const z = this.getFinalZ(this.positionX, this.currentLane)
    this.mesh.position.set(this.positionX, 0.5, z)
    this.updateRotation()
  }

  moveBackward() {
    this.positionX -= this.speed
    const z = this.getFinalZ(this.positionX, this.currentLane)
    this.mesh.position.set(this.positionX, 0.5, z)
    this.updateRotation()
  }

  changeLane(direction) {
    const newLane = this.targetLane + direction
    if (newLane > 0 && newLane <= this.laneCount) {
      this.targetLane = newLane
      this.laneChangeDirection = direction
      this.isChangingLane = true
      this.laneChangeProgress = 0
    }
  }

  reset() {
    this.currentLane = this.targetLane
    this.wrongAnswerRotationY = 0
    this.speed = this.options.carBaseSpeed
    this.isIncreaseSpeedPhase = false
    this.isDecreasingPhase = false
    this.positionX = this.options.offsetXStart
    this.mesh.position.set(this.positionX, 0.5, this.getFinalZ(this.positionX, this.currentLane))
    this.currentQuestionIndex = 0
    this.gemsInformation = this.options.gemsInformation
    this.gemCheckIndex = 0
  }

  setMesh() {
    this.mesh = this.resourses.items.carGLTFModel.scene

    this.mesh.scale.set(0.8, 0.8, 0.8)
    this.mesh.position.x = this.positionX
    this.mesh.position.z = this.getFinalZ(this.positionX, this.currentLane)
    this.mesh.position.y = 0.5
    this.scene.add(this.mesh)
    this.wheels = {}
    this.springs = {}
    this.mesh.traverse((child) => {
      if (child.name == 'backWheel') {
        this.wheels.back = child.children[0]
      }
      else if (child.name == 'frontWheel') {
        this.wheels.front = child.children[0]
        this.wheels.pivotFront = child
      }
      else if (child.name == 'springBackLeft') {
        this.springs.springBackLeft = child.children[0]
      }
      else if (child.name == 'springBackRight') {
        this.springs.springBackRight = child.children[0]
      }
      else if (child.name == 'springFrontLeft') {
        this.springs.springFrontLeft = child.children[0]
      }
      else if (child.name == 'springFrontRight') {
        this.springs.springFrontRight = child.children[0]
      }
      else if (child.name == 'Body') {
        this.bodyCar = child.children[0]
      }
    })
  }

  checkQuestionCollision() {
    if (this.currentQuestionIndex >= this.questionPositions.length) {
      if (this.isIncreaseSpeedPhase) {
        this.increseSpeedSuccessPhase()
        return
      }
      if (this.isDecreasingPhase) {
        this.decreaseSpeedAndDriftSuccessPhase()
        return
      }

      this.isIncreaseSpeedPhase = true
      this.experience.callBacks.onChangeIsUpdateTimer(false)
      return
    };

    const targetX = this.questionPositions[this.currentQuestionIndex]
    const distance = Math.abs(this.positionX - targetX)

    if (distance < this.checkThreshold) {
      const correctLane = this.options.questions[this.currentQuestionIndex].indexAnswer + 1

      if (this.targetLane === correctLane) {
        if (!this.isJumping && this.currentQuestionIndex + 1 != this.options.questions.length) {
          this.isJumping = true
          this.jumpStartY = 0.6
          this.jumpProgress = 0
        }
        this.currentQuestionIndex += 1
        if (this.experience.world.levels) {
          this.experience.world.levels.updateQuestions(this.currentQuestionIndex)
        }
        this.experience.callBacks.onQuestionChange()
        this.experience.callBacks.onQuestionStatusChange('success')
        this.experience.callBacks.onScoreChange(1)
      }
      else {
        if (!this.isReversing) {
          this.reverseStartX = this.positionX
          this.isReversing = true
          this.wrongAnswerRotationY = 0
        }
        this.experience.callBacks.onQuestionStatusChange('error')
      }
    }
  }

  increseSpeedSuccessPhase() {
    this.speed = MathUtils.lerp(this.speed, this.UpperSpeed, 15 * (this.time.delta / 1000))

    if (Math.ceil(this.speed) == this.UpperSpeed) {
      this.isIncreaseSpeedPhase = false
      this.isDecreasingPhase = true
      this.directionLastSuccessRotation = this.targetLane <= (this.laneCount / 2) ? 1 : -1
    }
  }

  decreaseSpeedAndDriftSuccessPhase() {
    this.speed = MathUtils.lerp(this.speed, this.options.carBaseSpeed, (this.time.delta / 1000))
    this.wrongAnswerRotationY = this.wrongAnswerRotationY + (-1 * this.directionLastSuccessRotation * (this.time.delta / 1000) * 2)
    this.currentLane = MathUtils.lerp(this.currentLane, this.currentLane + this.directionLastSuccessRotation, 0.02)

    if (this.wrongAnswerRotationY <= -Math.PI || this.wrongAnswerRotationY >= Math.PI) {
      this.wrongAnswerRotationY = 0
      const result = {
        status: 'success',
      }
      this.experience.callBacks.onResultGameChange(result)
    }
  }

  reverseStep(delta) {
    const currentX = this.positionX
    const endX = this.reverseStartX - this.reverseDistance
    if (currentX > endX) {
      this.positionX -= this.reverseSpeed * delta
      const t = (this.reverseStartX - this.positionX) / this.reverseDistance
      this.wrongAnswerRotationY = t * Math.PI * 2
    }
    else {
      this.isReversing = false
      this.wrongAnswerRotationY = 0
    }
  }

  playSpringEffect(delta) {
    this.progressLanding += delta
    const t = this.progressLanding / this.durationLanding
    const damping = Math.exp(-6 * t)
    const bounce = damping * Math.cos(10 * t * Math.PI)

    this.bodyCar.position.y = -bounce * this.bodyDrop

    for (const key in this.springs) {
      const spring = this.springs[key]
      spring.scale.y = 1 - bounce * this.springCompress
    }

    if (this.progressLanding > this.durationLanding) {
      this.bodyCar.position.y = 0
      for (const key in this.springs) {
        this.springs[key].scale.y = 1
      }
      this.isLanding = false
      this.progressLanding = 0
    }
  }

  jumpStep(delta) {
    this.jumpProgress += delta

    const t = this.jumpProgress / this.jumpDuration
    const clampedT = Math.min(t, 1)

    const jumpCurve = 4 * this.jumpHeight * clampedT * (1 - clampedT)

    this.mesh.position.y = this.jumpStartY + jumpCurve
    this.correctAnswerRotationY = Math.PI * 2 * clampedT

    if (!this.isLanding && t >= 0.95) {
      this.isLanding = true
    }
    if (t >= 1) {
      this.isJumping = false
      this.mesh.position.y = this.jumpStartY
      this.correctAnswerRotationY = 0
      this.jumpProgress = 0
    }
  }

  checkGemCollision() {
    if (this.gemCheckIndex >= this.gemsInformation.length) return
    const gem = this.gemsInformation[this.gemCheckIndex]

    if (gem.x < this.positionX - this.checkThreshold) {
      if (this.experience.world.gems) {
        this.experience.world.gems.passGem(this.gemCheckIndex)
      }
      this.gemCheckIndex++
      return
    }

    const xDiff = Math.abs(this.positionX - gem.x)

    const sameLane = this.targetLane === gem.lane

    if (sameLane && xDiff <= this.checkThreshold && !gem.collected) {
      if (this.experience.world.gems) {
        this.experience.world.gems.onGemColocted(this.gemCheckIndex)
        this.experience.callBacks.onGemColocted()
      }
      gem.collected = true
      this.gemCheckIndex++
    }
  }

  update() {
    const distancePerFrame = this.speed * (this.time.delta / 1000)
    this.positionX += distancePerFrame
    this.currentLane = MathUtils.lerp(this.currentLane, this.targetLane, (this.time.delta / 1000) * this.laneLerpSpeed)

    this.mesh.position.set(this.positionX, 0.5, this.getFinalZ(this.positionX, this.currentLane))

    this.updateRotation()

    if (this.wheels) {
      const rotationAngle = (distancePerFrame / this.wheelCircumference) * Math.PI * 2
      this.wheels.front.rotation.x += rotationAngle
      this.wheels.back.rotation.x += rotationAngle
    }

    this.checkQuestionCollision()
    this.checkGemCollision()

    if (this.isReversing) {
      this.reverseStep(this.time.delta / 1000)
    }

    if (this.isJumping) {
      this.jumpStep(this.time.delta / 1000)
    }

    if (this.isLanding) {
      this.playSpringEffect(this.time.delta / 1000)
    }
  }

  setDebug() {
    const CarFolder = this.debug.ui.addFolder('Car')
    CarFolder.add(this, 'speed').min(0).max(40).step(0.01).name('Base Speed Car')
  }
}
