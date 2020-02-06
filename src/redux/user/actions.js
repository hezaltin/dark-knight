import * as types from './actionTypes';
import defaultAPI from './api';

export const completeLogin = user => ({
  type: types.NETWORK_LOGIN_SUCCESS,
  payload: { user }
});

export const setCurrentUser = username => ({
  type: types.SET_CURRENT_USER,
  payload: { username }
});

export const submitLogin = (username, password, extraArgs = {}) => {
  const API = extraArgs.api || defaultAPI;
  return dispatch => {
    // TODO: pending state
    // dispatch({
    //   type:
    // })
    return API.login(username, password).then(response => {
      if (response.ok) {
        dispatch(setCurrentUser(username));
        // dispatch(completeLogin({ username }));
        dispatch(getAuthenticationStatus());
      }
    });
  };
};

export const completeNetworkLogout = username => ({
  type: types.NETWORK_LOGOUT_SUCCESS,
  payload: { username }
});

export const submitLogout = (username, extraArgs = {}) => {
  const API = extraArgs.api || defaultAPI;
  return dispatch => {
    dispatch(localLogout());
    // TODO: pending state
    // dispatch({
    //   type:
    // })
    return API.logout(username).then(response => {
      if (response.ok) {
        dispatch(completeNetworkLogout(username));
      }
    });
  };
};

export const localLogout = () => ({
  type: types.LOCAL_LOGOUT
});

export const getAuthenticationStatus = (extraArgs = {}) => {
  const API = extraArgs.api || defaultAPI;
  const apiRsponse = {
    authenticated: true,
    username: 'bc4377',
    profile: {
      id: 'bc4377',
      epass: 'bc4377',
      email: 'divya.naredla@dupont.com',
      name: {
        firstName: 'Divya',
        lastName: 'Naredla',
        fullName: 'Naredla, Divya'
      },
      approver: { id: 'fan', fullName: 'Fan Li' },
      previewCount: 0,
      retrieved: '2019-12-19T09:17:10.941779-05:00',
      roles: ['test-runner', 'user', 'admin', 'nobody']
    },
    disallowUpdates: false,
    appUsersOnly: false,
    appName: 'insight'
  };
  return dispatch => {
    // TODO: pending state
    // dispatch({
    //   type:
    // })
    dispatch({
      type: types.FETCH_AUTHSTATUS_SUCCESS,
      payload: { user: apiRsponse }
    });
    dispatch(completeLogin({ username: apiRsponse.username }));
    return API.status().then(response => {
      dispatch({
        type: types.FETCH_AUTHSTATUS_SUCCESS,
        payload: { user: response }
      });
      dispatch(completeLogin({ username: response.username }));
    });
  };
};
