import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import SearchView from '../../components/SearchView/SearchView'

import { 
  actions as searchActions, 
  selectors as searchSelectors 
} from '../../redux/search'

import { 
  actions as serviceActions, 
  selectors as serviceSelectors 
} from '../../redux/service'

import {
  actions as modelActions,
  selectors as modelSelectors
} from '../../redux/models'

import { bindSelectors } from '../utils/redux-utils'

const boundSearchSelectors = bindSelectors(searchSelectors, 'search')
const boundServiceSelectors = bindSelectors(serviceSelectors, 'service')
const boundModelSelectors = bindSelectors(modelSelectors, 'models') 

let SearchContainer = class SearchContainer extends Component {
  render() {
    return <SearchView {...this.props} detailPath="/detail/" />;
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    queryText: boundSearchSelectors.getVisibleQueryText(state),
    advancedQuery: boundSearchSelectors.getAdvancedQuery(state),
    stagedSearch: boundSearchSelectors.getStagedQuery(state),
    results: boundSearchSelectors.getSearchResults(state),
    facets: boundSearchSelectors.searchFacets(state),
    activeFilters: boundSearchSelectors.stagedFilters(state),
    executionTime: boundSearchSelectors.getSearchExecutionTime(state),
    total: boundSearchSelectors.getSearchTotal(state),
    totalPages: boundSearchSelectors.getSearchTotalPages(state),
    page: boundSearchSelectors.getPage(state),
    isSearchPending: boundSearchSelectors.isSearchPending(state),
    isSearchComplete: boundSearchSelectors.isSearchComplete(state),
    error: boundSearchSelectors.getSearchError(state),
    displayMode: boundSearchSelectors.getDisplayMode(state),
    // bookmarkPending: boundServiceSelectors.bookmarkPending(state),
    searchResultSchema: boundModelSelectors.getSchema(state, ownProps.scope, 'search-result'),
    searchFormSchema: boundModelSelectors.getSchema(state, ownProps.scope, 'search-form'),
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return bindActionCreators(
    {
      runSearch: searchActions.runSearch,
      setQueryText: searchActions.setQueryText,
      setAdvancedQuery: searchActions.setAdvancedQuery,
      changePage: searchActions.changePage,
      addFilter: searchActions.addFilter,
      removeFilter: searchActions.removeFilter,
      replaceFilter: searchActions.replaceFilter,
      clearFilters: searchActions.clearFilters,
      setFilters: searchActions.setFilters,
      setDisplayMode: searchActions.setDisplayMode,
      clearSearchResults: searchActions.clearSearchResults,
      searchForSimilar: searchActions.searchForSimilar,
      addBookmark: serviceActions.addBookmark,
      removeBookmark: serviceActions.removeBookmark,
      loadModel: modelActions.loadModel,
      loadSchema: modelActions.loadSchema,
    },
    dispatch
  );
};

SearchContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchContainer);

export default SearchContainer;