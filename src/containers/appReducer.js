import { combineReducers } from 'redux'
import search from '../redux/search'
import documents from '../redux/crud'
import user, { actionTypes } from '../redux/user'
import service from '../redux/service'
import entry from "../redux/entry"
import home from '../redux/home'
import models from '../redux/models'

const coreAppReducer = (state, action) => {
  // empty out state on logout, so we don't leak info
  if (action.type === actionTypes.LOCAL_LOGOUT) {
    state = undefined;
  }

  return combineReducers({ search, documents, service, user, entry, home, models})(state, action);
};

export default coreAppReducer;
