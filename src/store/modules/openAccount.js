const openAccount = {
  namespaced: true,
  state: {
    stateUid: '',
    surveyUid: '',
    questionnaireUid: ''
  },
  getters: {},
  mutations: {
    SET_UID(state, params) {
      switch (params.type) {
        case 'state':
          state.stateUid = params.uid
          break
        case 'survey':
          state.surveyUid = params.uid
          break
        case 'questionnaire':
          state.questionnaireUid = params.uid
          break
      }
    }
  },
  actions: {}
}

export default openAccount
