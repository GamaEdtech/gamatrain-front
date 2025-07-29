// holds your root state
export const strict = false

export const state = () => ({
  userId: '',
  userName: '',
  fName: '',
  lName: '',
  lastPath: '',
  examId: '',
  examCode: '',
  previewTestList: [],

  lastSelectedCurriculum: null,
  lastSelectedGrade: null,
  lastSelectedSubject: null,
  lastSelectedHoldingLevel: null,

  allExamStats: [], // Start exam page
  allExamStats2: [], // Start exam page
})

// contains your actions
export const actions = {}

// contains your mutations
export const mutations = {
  // For store last path of user for redirect after login or pay
  setLastPath(state, lastPath) {
    state.lastPath = lastPath
  },

  setCurriculum(state, curriculum) {
    state.lastSelectedCurriculum = curriculum
  },
  setGrade(state, grade) {
    state.lastSelectedGrade = grade
  },
  setSubject(state, subject) {
    state.lastSelectedSubject = subject
  },
  setHoldingLevel(state, holding_level) {
    state.lastSelectedHoldingLevel = holding_level
  },

  // For online exam creation
  setCurrentExamId(state, examId) {
    state.examId = examId
  },
  setCurrentExamCode(state, examCode) {
    state.examCode = examCode
  },
  setPreviewTestList(state, previewTestList) {
    state.previewTestList = previewTestList
  },
  addPreviewTestList(state, previewTestList) {
    state.previewTestList.push(previewTestList)
  },
  removePreviewTestList(state, id) {
    var previewIndex = state.previewTestList.findIndex(x => x.id == id)
    state.previewTestList.splice(previewIndex, 1)
  },

  initNewExamStats(state, payload) {
    console.log(payload)
    state.allExamStats.push(payload)
  },

  updateExamStats(state, payload) {
    console.log('in update exam mutation')
    // Find the object in the array based on its ID and update its properties
    const index = state.allExamStats2.findIndex(obj => obj.id === payload.id)
    console.log(index)
    if (index !== -1) {
      console.log(payload)
      state.allExamStats2[index] = {
        ...state.allExamStats2[index],
        ...payload,
      }
    }
    else {
      state.allExamStats2.push(payload)
    }
  },

  updateExamReminTime(state, payload) {
    console.log('in remin time section' + payload.index)
    console.log('in remin time section' + payload.value)
    state.allExamStats[payload.index].remainTime = payload.value
  },
}

// your root getters
export const getters = {
  getUserId(state) {
    return state.userId
  },
  getUserName(state) {
    return state.userName
  },
  getLastPath(state) {
    return state().lastPath
  },

  getCurriculum(state) {
    return state().lastSelectedCurriculum
  },

  // For online exam creation
  getCurrentExamId(state) {
    return state().examId
  },
  getCurrentExamCode(state) {
    return state().examCode
  },

  getPreviewTestList(state) {
    return state.previewTestList
  },
  getPreviewTestListLength(state) {
    return state.previewTestList.length
  },

  // Get user participation exam data
  getExamStatsData(state) {
    return state.examParticipationData
  },
}
