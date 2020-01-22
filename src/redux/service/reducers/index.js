import { combineReducers } from 'redux';
import bookmark, { selectors as bookmarkSelectors } from './bookmark';
import request, { selectors as requestSelectors } from './request';

export default combineReducers({ bookmark, request });

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
  ...bindSelectors(bookmarkSelectors, 'bookmark'),
  ...bindSelectors(requestSelectors, 'request')
};


