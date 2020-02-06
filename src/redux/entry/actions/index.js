import {
  FETCH_SCHEMA_LIST,
  FETCH_SCHEMA_LIST_SUCCESS,
  FETCH_SCHEMA_LIST_FAILURE,
  SELECT_SCHEMA,
  DESELECT_SCHEMA,
  FETCH_SCHEMA,
  FETCH_SCHEMA_SUCCESS,
  FETCH_SCHEMA_FAILURE,
  CREATE_DATA_ENTRY,
  CREATE_DATA_ENTRY_SUCCESS,
  CREATE_DATA_ENTRY_FAILURE,
  CHECK_FOR_DUPLICATE,
  CHECK_FOR_DUPLICATE_SUCCESS,
  CHECK_FOR_DUPLICATE_FAILURE,
} from "../actionTypes"
import { fetchSchemaSuccess } from './fetchSchemaSuccess'

const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response.json()
  } else {
    const error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

export const getSchemaList = (type, query) => {
  return dispatch => {
    dispatch({
      type: FETCH_SCHEMA_LIST,
      payload: { type, query }
    });
    return fetch(new URL(`api/service/schema?type=${type}&view=schema-list&query=${query || '*'}`, document.baseURI).toString(), {
      method: 'GET',
      credentials: 'same-origin'
    })
    .then(checkStatus)
    .then(
      data => dispatch({
        type: FETCH_SCHEMA_LIST_SUCCESS,
        payload: data
      }),
      error => dispatch({
        type: FETCH_SCHEMA_LIST_FAILURE,
        payload: { error: error.message }
      })
    )
  };
};

export const selectSchema = (type, view) => {
  return dispatch => {
    dispatch({
      type: SELECT_SCHEMA,
      payload: type
    })
    dispatch({
      type: FETCH_SCHEMA
    })
    dispatch({
      type: FETCH_SCHEMA_SUCCESS,
      payload: fetchSchemaSuccess,
    })
    // TODO: Avoid to directly call MarkLogic APIs
    return fetch(new URL(`/api/crud/schema?uri=/models${type}/schema.json&view=${view}`, document.baseURI).toString(), {
      credentials: "same-origin"
    })
    .then(checkStatus)
    .then(
      data => dispatch({
        type: FETCH_SCHEMA_SUCCESS,
        payload: data,
      }),
      error => dispatch({
        type: FETCH_SCHEMA_FAILURE,
        payload: { error: error.message },
      })
    )
  }
}

export const deselectSchema = () => {
  return dispatch => {
    return dispatch({
      type: DESELECT_SCHEMA,
    })
  }
}

export const checkDuplicate = (uri) => {
  console.log('dupcheck', uri)
  return dispatch => {
    dispatch({
      type: CHECK_FOR_DUPLICATE,
      payload: uri
    })

    let url =  `/api/entry/check-duplicate?uri=${uri}`
    return fetch(new URL(url, document.baseURI).toString(), {
      method: 'GET',
      credentials: "same-origin"
  })
    .then(checkStatus)
    .then(
      data => dispatch({
        type: CHECK_FOR_DUPLICATE_SUCCESS,
        payload: data
      }),
      error => dispatch({
        type: CHECK_FOR_DUPLICATE_FAILURE,
        payload: { error: error.message }
      })
    )
  }
}

export const createDataEntry = (uri, data) => {
  return dispatch => {
    dispatch({
      type: CREATE_DATA_ENTRY,
      payload: { uri, data }
    })

    let url =  `/api/entry/formdata?uri=${uri}`
    return fetch(new URL(url, document.baseURI).toString(), {
      method: 'POST',
      credentials: "same-origin",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
  })
    .then(checkStatus)
    .then(
      res => dispatch({
        type: CREATE_DATA_ENTRY_SUCCESS,
        payload: { message: `${uri} created.` }
      }),
      error => dispatch({
        type: CREATE_DATA_ENTRY_FAILURE,
        payload: { error: error.message }
      })
    )
  }
}
