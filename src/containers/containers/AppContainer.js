import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  actions as userActions,
  selectors as userSelectors
} from '../../redux/user';

import {
  actions as modelActions,
  selectors as modelSelectors
} from '../../redux/models';

import { bindSelectors } from '../utils/redux-utils';

const boundUserSelectors = bindSelectors(userSelectors, 'user');
const boundModelSelectors = bindSelectors(modelSelectors, 'models');

class AppContainer extends React.Component {
  constructor(props) {
    super(props);
    // Move fetch() to global so errors, presently just 401s, can be intercepted
    const fetch = global.fetch;

    global.fetch = function(url, options) {
      return fetch(url, options).then(response => {
        if (response.status === 401) {
          props.getAuthenticationStatus();
        }
        return response;
      });
    };
  }

  componentDidMount() {
    if (!this.props.currentUser) {
      this.props.getAuthenticationStatus();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isAuthenticated && !this.props.isAuthenticated) {
      this.props.localLogout();
    }

    // Once logged in, load app configuration model
    if (!prevProps.isAuthenticated && this.props.isAuthenticated) {
      const appId = `/applications/${process.env.REACT_APP_ID}`;
      this.props.loadModel(appId);
    }
  }

  render() {
    if (this.props.appModelPending) {
      return null;
    }
    return this.props.render(this.props);
  }
}

AppContainer.propTypes = {
  currentUser: PropTypes.string,
  profile: PropTypes.object,
  isAuthenticated: PropTypes.bool.isRequired,
  getAuthenticationStatus: PropTypes.func.isRequired,
  render: PropTypes.func.isRequired,
  submitLogout: PropTypes.func.isRequired,
  localLogout: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => {
  const appId = `/applications/${process.env.REACT_APP_ID}`;
  return {
    isAuthenticated:
      boundUserSelectors.isCurrentUserAuthenticated(state) || true,
    currentUser: boundUserSelectors.currentUser(state),
    profile: boundUserSelectors.profile(state),
    appModelPending: boundModelSelectors.isModelFetchPending(state, appId),
    appModel: boundModelSelectors.getModel(state, appId),

    ...ownProps
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      submitLogout: userActions.submitLogout,
      localLogout: userActions.localLogout,
      getAuthenticationStatus: userActions.getAuthenticationStatus,
      loadModel: modelActions.loadModel,
      loadSchema: modelActions.loadSchema
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppContainer);
