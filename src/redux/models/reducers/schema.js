import * as types from '../actionTypes'

const schemaReducer = (state = {}, action) => {
  switch (action.type) {
    case types.FETCH_SCHEMA_REQUESTED:
      return {
        ...state,
        content: null,
        pending: true
      };
    case types.FETCH_SCHEMA_SUCCESS:
      return {
        ...state,
        content: action.payload.response.content,
        pending: false,
        error: undefined
      };
    case types.FETCH_SCHEMA_FAILURE:
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
  if (action.payload && action.payload.object && action.payload.view) {
    const objectState = state[action.payload.object] || {default: null}
    return {
      ...state,
      [action.payload.object]: {
        ...objectState,
        [action.payload.view]: schemaReducer(
          objectState[action.payload.view],
          action
        )
      }
    }
  }
  return state
}

export const selectors = {
  isSchemaFetchPending: (state, object, schema) => 
    !!(state[object] && state[object][schema] && state[object][schema].pending),
  getSchema: (state, object, view) => state[object] && state[object][view] && state[object][view].content,
  getSchemaError: (state, object, view) => state[object] && state[object][view].error,
};