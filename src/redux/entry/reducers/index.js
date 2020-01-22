import { combineReducers } from 'redux'
import schema, { selectors as schemaSelectors } from './schema'
import dataEntry, { selectors as dataEntrySelectors } from './dataEntry'

export default combineReducers({ schema, dataEntry })

// SELECTORS
const bindSelector = (selector, mountPoint) => {
  return (state, ...args) => {
    return selector(state[mountPoint], ...args)
  }
}

const bindSelectors = (selectors, mountPoint) => {
  return Object.keys(selectors).reduce((bound, key) => {
    bound[key] = bindSelector(selectors[key], mountPoint)
    return bound
  }, {})
}

export const selectors = {
  ...bindSelectors(schemaSelectors, 'schema'),
  ...bindSelectors(dataEntrySelectors, 'dataEntry')
}

