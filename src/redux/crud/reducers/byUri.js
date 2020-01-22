import * as types from '../actionTypes';
import X2JS from 'x2js';
let x2js;

// TODO: extract, which may make writing the selectors simpler
const documentReducer = (state = {content: {}}, action) => {
  switch (action.type) {
    case types.DESELECT_DOC:
      return {
        ...state,
        content: undefined,
        contentType: undefined,
      };
    case types.FETCH_DOC_REQUESTED:
      return {
        ...state,
        pending: true
      };
    case types.FETCH_DOC_SUCCESS:
      // console.log('payload', action.payload)
      // const content = {
      //   ...state.content,
      //   [action.payload.view]: {
      //     content: action.payload.content,
      //     contentType: action.payload.contentType,
      //   }
      // }
      return {
        ...state,
        content: action.payload.content,
        contentType: action.payload.contentType,
        pending: false,
        error: undefined
      };
    case types.FETCH_DOC_FAILURE:
      return {
        ...state,
        pending: false,
        error: action.payload.error
      };
    default:
      return state;
  }
};

export default (state = {}, action) => {
  if (action.payload && action.payload.uri) {
    return {
      ...state,
      [action.payload.uri]: documentReducer(
        state[action.payload.uri],
        action
      )
    };
  }
  return state;
};

// SELECTORS
const xmlToJson = xml => {
  x2js = x2js || new X2JS();
  return x2js.xml2js(xml);
};

// const getDocumentView = (state, uri, view) => state[uri] && state[uri].content && state[uri].content[view] && state[uri].content[view].content
const getDocumentView = (state, uri, view) => state[uri] && state[uri].content 

const getDocumentViewContentType = (state, uri, view) => state[uri] && state[uri].contentType

export const selectors = {
  isDocumentFetchPending: (state, uri) =>
    !!(state[uri] && state[uri].pending),
  documentView: getDocumentView,
  // jsonByUri: (state, uri) => {
  //   const content = getDocumentByUri(state, uri);
  //   if (!content) {
  //     return;
  //   }
  //   if (getContentTypeByUri(state, uri).indexOf('application/xml') !== -1) {
  //     return xmlToJson(content);
  //   } else {
  //     return content;
  //   }
  // },
  documentViewContentType: getDocumentViewContentType,
  errorByUri: (state, uri) => state[uri] && state[uri].error
};
