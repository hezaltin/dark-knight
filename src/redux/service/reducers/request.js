import * as types from '../actionTypes';

export default (state = {}, action) => {
  if (action.payload && action.payload.docId) {
    switch (action.type) {
      case types.DOCUMENT_REQUEST_SUBMITTED:
        return {
          ...state,
          docId: action.payload.docId,
          type: 'request',
          pending: true
        };

      case types.DOCUMENT_REQUEST_SUCCESS: {

        return {
          ...state,
          pending: false,
          error: undefined
        }
      }

      case types.DOCUMENT_REQUEST_FAILURE:
        return {
          ...state,
          pending: false,
          error: action.payload.error
        };

      default:
        return state;
    }
  } else {
    return state;
  }
};

// SELECTORS
export const selectors = {
  requestDocId: state => state.docId,
  requestError: state => state.error,
  requestActionType: state => state.type,
  isRequestPending: state => state.pending
};
