/* global require */
import { fetchModel } from './fetchModel'
import * as types from '../actionTypes'

require('isomorphic-fetch')

/**
 * Load schema definition for a JSON document
 * @param {*} object The class of the object in ontology
 * @param {*} view The specific view for the object: default (as stored in MarkLogic), search (search response) etc.
 * @param {*} type The document type (XML or JSON)
 */
export const loadSchema = (object, view, format) => {
  format = format.toLowerCase()
  return (dispatch, getState) => {   
    const state = getState()
    if (!state.models.schema[object] || !state.models.schema[object][view]) {
      dispatch({
        type: types.FETCH_SCHEMA_REQUESTED,
        payload: { object, view, format }
      })
      
      const url = new URL(`/api/crud/schema?uri=/models${object}/schema.${format}&view=${view}`, document.baseURI)

      return fetch(url.toString(), { credentials: 'same-origin' })
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText)
        }

        switch (format) {
          case 'json':
            return response.json()

          case 'xml':
          default:
            return response.text
        }
      })
      .then(response => {
        return {
          content: response.content || response
        };
      })
      .then(
        response => {
          dispatch({
            type: types.FETCH_SCHEMA_SUCCESS,
            payload: {
              object, view, response
            }
          })
        },
        error => {
          dispatch({
            type: types.FETCH_SCHEMA_FAILURE,
            payload: {
              error: 'Error fetching schema: ' + error.message,
              object, view
            }
          })
        }
      )
    }
  }
}

/**
 * Load ontology model for a object
 * @param {*} object The class of the object in ontology
 */
export const loadModel = (object) => {
  return (dispatch, getState) => {   
    const state = getState()
    if (!state.models[object]) {
      // dispatch({
      //   type: types.FETCH_MODEL_REQUESTED,
      //   payload: { object }
      // })
      dispatch({
        type: types.FETCH_MODEL_SUCCESS,
        payload: {
          object, 
          fetchModel
        }
      })
      
      const url = new URL(`/api/crud?uri=/models${object}/config.model.jsonld`, document.baseURI)
      return fetch(url.toString(), { credentials: 'same-origin' })
        .then(response => {
          dispatch({
            type: types.FETCH_MODEL_SUCCESS,
            payload: {
              object, 
              fetchModel
            }
          })
          if (!response.ok) throw new Error(response.statusText);
          return response.json()
        })
        .then(response => {
          return {
            content: response.content || response
          };
        })
        .then(
          response => {
            dispatch({
              type: types.FETCH_MODEL_SUCCESS,
              payload: {
                object, 
                response
              }
            })
          },
          error => {
            // dispatch({
            //   type: types.FETCH_MODEL_FAILURE,
            //   payload: {
            //     object, 
            //     error: 'Error fetching model: ' + error.message
            //   }
            // })
            
          }
        )
    }
  }
}