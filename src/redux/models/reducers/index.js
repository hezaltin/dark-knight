import { combineReducers } from 'redux'
import schema, { selectors as schemaSelectors } from './schema'
import model, { selectors as modelSelectors } from './model'

export default combineReducers({ schema, model });

// SELECTORS
const bindSelector = (selector, mountPoint) => {
  return (state, ...args) => {
    return selector(state[mountPoint], ...args);
  };
};

const bindSelectors = (selectors, mountPoint) => {
  return Object.keys(selectors).reduce((bound, key) => {
    bound[key] = bindSelector(selectors[key], mountPoint);
    return bound;
  }, {});
};

export const selectors = {
  ...bindSelectors(schemaSelectors, 'schema'),
  ...bindSelectors(modelSelectors, 'model'),
};
