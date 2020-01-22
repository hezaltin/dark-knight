import * as types from '../actionTypes';

export default (state = {}, action) => {
  if (action.payload && action.payload.docId) {
    switch (action.type) {
      case types.ADD_BOOKMARK_REQUESTED:
        return {
          ...state,
          docId: action.payload.docId,
          type: 'bookmark',
          pending: true
        };

      case types.ADD_BOOKMARK_SUCCESS: {

        return {
          ...state,
          pending: false,
          error: undefined
        }
      }

      case types.ADD_BOOKMARK_FAILURE:
        return {
          ...state,
          pending: false,
          error: action.payload.error
        };

      case types.REMOVE_BOOKMARK_REQUESTED:
        return {
          ...state,
          docId: action.payload.docId,
          type: 'unbookmark',
          pending: true
        };

      case types.REMOVE_BOOKMARK_SUCCESS:
        return {
          ...state,
          content: action.payload.doc,
          docId: action.payload.response.docId,
          pending: false,
          error: undefined
        };

      case types.REMOVE_BOOKMARK_FAILURE:
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
  bookmarkDocId: state => state.docId,
  bookmarkError: state => state.error,
  bookmarkActionType: state => state.type,
  isBookmarkPending: state => state.pending
};
