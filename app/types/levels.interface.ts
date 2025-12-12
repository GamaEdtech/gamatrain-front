export interface Step {
  reward?: {
    room: 'room1' | 'room2' | 'room3' | 'room4'
    position: 'position1' | 'position2' | 'position3' | 'position4'
    amount: number
  }
  door001: {
    problem: string
    answer: string
  }
  door002: {
    problem: string
    answer: string
  }
  door003: {
    problem: string
    answer: string
  }
  door004: {
    problem: string
    answer: string
  }
}

export interface Level {
  step1: Step
  step2: Step
  step3: Step
  step4: Step
}

export interface Levels {
  [key: string]: Level
}
