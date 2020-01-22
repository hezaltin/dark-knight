import {
  CREATE_DATA_ENTRY,
  CREATE_DATA_ENTRY_SUCCESS,
  CREATE_DATA_ENTRY_FAILURE,
  CHECK_FOR_DUPLICATE,
  CHECK_FOR_DUPLICATE_SUCCESS,
  CHECK_FOR_DUPLICATE_FAILURE,
} from "../actionTypes"

const initialState = {
  uri: undefined,
  info: undefined,
  pending: false,
  error: undefined,
  duplicate: false,
  checkPending: false,
  checkError: undefined,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case CHECK_FOR_DUPLICATE:
      return {
        ...state,
        uri: action.payload,
        checkPending: true,
        duplicate: false,
      }
    case CHECK_FOR_DUPLICATE_SUCCESS:
      return {
        ...state,
        checkPending: false,
        checkError: undefined,
        duplicate: action.payload && action.payload.duplicate,
      }
    case CHECK_FOR_DUPLICATE_FAILURE:
      return {
        ...state,
        checkPending: false,
        checkError: action.payload && action.payload.error
      }

    case CREATE_DATA_ENTRY:
      return {
        ...state,
        pending: true,
      }
    case CREATE_DATA_ENTRY_SUCCESS:
      return {
        ...state,
        uri: action.payload.uri,
        info: action.payload.info,
        pending: false,
        error: undefined,
      }
    case CREATE_DATA_ENTRY_FAILURE:
      return {
        ...state,
        pending: false,
        error: action.payload && action.payload.error
      }
    default:
      return state
  }
}

// SELECTORS
export const selectors = {
  uri: state => state.uri,
  info: state => state.info,
  pending: state => state.pending,
  error: state => state.error,
  duplicate: state => state.duplicate,
  checkPending: state => state.checkPending,
  checkError: state => state.checkError,
}