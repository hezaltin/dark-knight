import React from 'react';
import { connect } from 'react-redux';

import HomeView from '../../components/HomeView/HomeView'

import { bindActionCreators } from 'redux';

import { actions, selectors } from 'grove-crud-redux';
import { bindSelectors } from '../utils/redux-utils';


// TODO: Make use of HomeContainer
let HomeContainer = class HomeContainer extends React.Component {
  render() {
    return <HomeView {...this.props} />;
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {},
    dispatch
  );

HomeContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeView);

export default HomeContainer;
