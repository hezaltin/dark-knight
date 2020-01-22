/* global require */
import * as types from '../actionTypes';

require('isomorphic-fetch');

const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
};

const defaultAPI = {
  getDoc: (uri, type, view) => {
    let contentType;
    const url = new URL(`/api/crud?uri=${uri}&view=${view || 'default'}`, document.baseURI)
    return fetch(url.toString(), { credentials: 'same-origin' })
      .then(response => {
        if (!response.ok) throw new Error(response.statusText);
        contentType = response.headers.get('content-type');
        if (contentType && contentType.indexOf('application/json') !== -1) {
          return response.json();
        } else {
          return response.text();
        }
      })
      .then(response => {
        return {
          content: response.content || response,
          contentType: response.contentType || contentType
        };
      });
  },
  createDoc: (uri, type, doc) => {
    const url = new URL(`/api/crud/${type}?uri=${uri}`, document.baseURI)
    return fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: doc,
      credentials: 'same-origin'
    })
      .then(checkStatus)
      .then(response => {
        return {
          docId: response.headers.get('location')
        };
      });
  }
};

export const fetchDoc = (uri, type, view, extraArgs = {}) => {

  return dispatch => {
    dispatch({
      type: types.DESELECT_DOC,
      payload: null
    })
    dispatch({
      type: types.FETCH_DOC_REQUESTED,
      payload: { uri, type, view }
    })
    let contentType
    const url = new URL(`/api/crud/document-view?uri=${uri}&view=${view}`, document.baseURI)
    return fetch(url.toString(), { credentials: 'same-origin' })
    .then(response => {
      if (!response.ok) throw new Error(response.statusText);
      contentType = response.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') !== -1) {
        return response.json();
      } else {
        return response.text();
      }
    })
    .then(
      response =>
        dispatch({
          type: types.FETCH_DOC_SUCCESS,
          payload: {
            view: view,
            content: response.content || response,
            contentType: response.contentType || contentType,
            uri
          }
        }),
      error => {
        dispatch({
          type: types.FETCH_DOC_FAILURE,
          payload: {
            error: 'Error fetching document: ' + error.message,
            uri
          }
        });
      }
    );
  };
};

export const createDoc = (doc, extraArgs = {}) => {
  const API = extraArgs.api || defaultAPI;
  return dispatch => {
    dispatch({
      type: types.CREATE_DOC_REQUESTED,
      payload: { doc }
    });

    return API.createDoc(doc).then(
      response => {
        dispatch({
          type: types.CREATE_DOC_SUCCESS,
          payload: {
            response,
            doc
          }
        });
      },
      error => {
        dispatch({
          type: types.CREATE_DOC_FAILURE,
          payload: {
            error: 'Error creating document: ' + error.message,
            doc
          }
        });
      }
    );
  };
};

