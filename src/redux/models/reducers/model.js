import * as types from '../actionTypes'

const modelReducer = (state = {}, action) => {
  switch (action.type) {
    case types.FETCH_MODEL_REQUESTED:
      return {
        ...state,
        content: null,
        pending: true
      };
    case types.FETCH_MODEL_SUCCESS:
      return {
        ...state,
        content: action.payload.response.content,
        pending: false,
        error: undefined
      };
    case types.FETCH_MODEL_FAILURE:
      return {
        ...state,
        pending: false,
        error: action.payload.error
      };
    default:
      return state
  }
}

export default (state = {}, action) => {
  if (action.payload && action.payload.object) {
    return {
      ...state,
      [action.payload.object]: modelReducer(
        state[action.payload.object],
        action
      )
    }
  }
  return state
}

export const selectors = {
  isModelFetchPending: (state, object) => !!(state[object] && state[object].pending),
  // getModel: (state, object) => state[object] && state[object].content,
  getModel: (state, object) => state[object] && state[object].content,
  getModelError: (state, object) => state[object] && state[object].error,
};