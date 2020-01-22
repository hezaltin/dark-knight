import * as types from '../actionTypes'
import * as searchTypes from '../../search/actionTypes'

require('isomorphic-fetch')

const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
};

export const addBookmark = (uri, extraArgs = {}) => {
  return dispatch => {
    dispatch({
      type: types.ADD_BOOKMARK_REQUESTED,
      payload: { uri }
    });
    return fetch(new URL('/api/service/bookmark/' + encodeURIComponent(uri), document.baseURI).toString(), {
      method: 'POST',
      // headers: {
      //   'Content-Type': 'application/json'
      // },
      // body: {},
      credentials: 'same-origin'
    })
      .then(checkStatus)
      .then(dispatch({
        type: searchTypes.UPDATE_RESULT_BOOKMARK,
        payload: {
          uri,
          bookmarked: true
        }
      }))
      // .then(response => {
      //   return {
      //     docId: response.headers.get('location')
      //   };
      // });
  }
}


export const removeBookmark = (uri, extraArgs = {}) => {
  return dispatch => {
    dispatch({
      type: types.REMOVE_BOOKMARK_REQUESTED,
      payload: { uri }
    });

    return fetch(new URL('/api/service/unbookmark/' + encodeURIComponent(uri), document.baseURI).toString(), {
      method: 'POST',
      // headers: {
      //   'Content-Type': 'application/json'
      // },
      // body: {},
      credentials: 'same-origin'
    })
      .then(checkStatus)
      .then(dispatch({
        type: searchTypes.UPDATE_RESULT_BOOKMARK,
        payload: {
          uri,
          bookmarked: false
        }
      }))
      // .then(response => {
      //   return {
      //     docId: response.headers.get('location')
      //   };
      // });
  }
}

export const submitDocRequest = (uri, extraArgs = {}) => {
  return dispatch => {
    dispatch({
      type: types.DOCUMENT_REQUEST_SUBMITTED,
      payload: { uri }
    });
    return fetch(new URL('/api/service/request/' + encodeURIComponent(uri), document.baseURI).toString(), {
      method: 'POST',
      // headers: {
      //   'Content-Type': 'application/json'
      // },
      // body: {},
      credentials: 'same-origin'
    })
      .then(checkStatus)
      .then(
        data => dispatch({
          type: types.DOCUMENT_REQUEST_SUCCESS,
          payload: { message: data.message }
        }),
        error => dispatch({
          type: types.DOCUMENT_REQUEST_FAILURE,
          payload: { error: error.message }
        })
      )
      // .then(response => {
      //   return {
      //     docId: response.headers.get('location')
      //   };
      // });
  }
}