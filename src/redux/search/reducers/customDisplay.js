import { combineReducers } from 'redux';
import * as bareTypes from '../actionTypes';

export const createReducer = config => {
  let types = bareTypes;
  if (config && config.namespace) {
    types = Object.keys(types).reduce((newTypes, typeKey) => {
      newTypes[typeKey] = config.namespace + '/' + types[typeKey];
      return newTypes;
    }, {});
  }

  const displayMode = (state = 'compact', action) => {
    switch (action.type) {
      case types.SET_DISPLAY_MODE:
        return action.payload.mode
      default:
        return state
    }
  };

  return combineReducers({
    displayMode
  });
};

// SELECTORS
export const selectors = {
  getDisplayMode: state => state.displayMode
};
