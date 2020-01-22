import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import AboutView from '../../components/AboutView/AboutView'

import { actions, selectors } from '../../redux/search';
import { actions as srvActions, selectors as srvSelectors } from '../../redux/service';
import { bindSelectors } from '../utils/redux-utils';


const boundSelectors = bindSelectors(selectors, 'search');
const boundSrvSelectors = bindSelectors(srvSelectors, 'service')

let AboutContainer = class AboutContainer extends Component {
  
  render() {
    const children = this.props.children
    
    return <>
      {children}
    </>
  }
};

const mapStateToProps = (state, ownProps) => {
  // TODO: shorten method names by removing 'get' and 'Search'?
  const sel = ownProps.selectors || boundSelectors
  const srvSel = boundSrvSelectors
  return {
    
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  let myActions = ownProps.actions || actions;

  return bindActionCreators(
    {

    },
    dispatch
  );
};

AboutContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AboutContainer);

export default AboutContainer;