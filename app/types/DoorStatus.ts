export interface Doors {
  door001: boolean
  door002: boolean
  door003: boolean
  door004: boolean
}

export interface Step {
  step1: Doors
  step2: Doors
  step3: Doors
  step4: Doors
}

export interface Level {
  id: string
  steps: Step
}
