import {
  FETCH_SCHEMA_LIST,
  FETCH_SCHEMA_LIST_SUCCESS,
  FETCH_SCHEMA_LIST_FAILURE,
  SELECT_SCHEMA,
  DESELECT_SCHEMA,
  FETCH_SCHEMA,
  FETCH_SCHEMA_SUCCESS,
  FETCH_SCHEMA_FAILURE
} from "../actionTypes"

const initialState = {
  entity: undefined,
  query: '*',
  schemaList: [],
  schemaListPending: false,
  schemaListError: undefined,
  selectedSchema: undefined,
  schema: {},
  schemaPending: false,
  schemaError: undefined,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SCHEMA_LIST:
      return {
        ...state,
        entity: action.payload.entity,
        query: action.payload.query,
        schemaListPending: true,
      }
    case FETCH_SCHEMA_LIST_SUCCESS:
      return {
        ...state,
        schemaListPending: false,
        schemaList: action.payload,
        schemaListError: undefined,
      }
    case FETCH_SCHEMA_LIST_FAILURE:
      return {
        ...state,
        schemaListPending: false,
        schemaListError: action.payload && action.payload.error,
      }
    case SELECT_SCHEMA:
      return {
        ...state,
        selectedSchema: action.payload,
      }
    case DESELECT_SCHEMA:
      return {
        ...state,
        selectedSchema: undefined,
        schema: {}
      }
    case FETCH_SCHEMA: 
      return {
        ...state,
        schemaPending: true,
      }
    case FETCH_SCHEMA_SUCCESS:
      return {
        ...state,
        schemaPending: false,
        schema: action.payload,
        schemaError: undefined,
      }
    case FETCH_SCHEMA_FAILURE:
      return {
        ...state,
        schemaPending: false,
        schemaError: action.payload && action.payload.error
      }
    default:
      return state

  }
}

// SELECTORS
export const selectors = {
  entity: state => state.entity,
  query: state => state.query,
  schemaList: state => state.schemaList,
  schemaListPending: state => state.schemaListPending,
  schemaListError: state => state.schemaListError,
  selectedSchema: state => state.selectedSchema,
  schema: state => state.schema,
  schemaPending: state => state.schemaPending,
  schemaError: state => state.schemaError,
};