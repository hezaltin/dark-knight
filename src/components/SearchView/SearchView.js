import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';

import SearchBar from './SearchBar';
import Facets from './Facets/Facets';
import SearchResponseView from './SearchResponseView';
import Fade from '../animations/Fade';

class SearchView extends React.Component {

  constructor(props) {
    super(props)
    // console.log('this.init==>',this.props)

    // this.state = { resultComponent: this.props.match.url == "/search/product" ? 'Card' : 'List' }
  }

  setDisplayMode = (value) => {
    this.props.setDisplayMode(value)
  }

  clearSearchResults = (value) => {
    this.props.clearSearchResults(value)
  }



  setQueryText = (value) => {
    this.props.setQueryText(value)
  }

  setAdvancedQuery = (value) => {
    this.props.setQueryText(value)
  }

  addBookmark = (value) => {
    this.props.addBookmark(value)
  }

  removeBookmark = (value) => {
    this.props.removeBookmark(value)
  }

  handlePageSelection = (pageNumber) => {
    if (pageNumber !== this.props.page) {
      this.props.changePage(pageNumber)
    }
  }

  componentDidMount = () => {
    this.props.loadSchema(this.props.scope, 'search-result', 'json')
    this.props.loadSchema(this.props.scope, 'search-form', 'json')
  }

  componentDidUpdate = (prevProps) => {   
    if (
      // Intentionally using != to test object reference (ie, is it the
      // same object?) Because our Redux flow will swap out the filters
      // object on any change, but keep it referentially the same otherwise
      prevProps.stagedSearch.filters != this.props.stagedSearch.filters) {
      this.search()
    }
    if (prevProps.stagedSearch.page !== this.props.stagedSearch.page) {
      // TODO: DRY up with this.search()?
      this.props.runSearch(this.props.stagedSearch, { type: this.props.match.params.type, scope: this.props.scope })
    }

    if (prevProps.match.url != this.props.match.url) {
      this.search()
    }
    
    if (prevProps.scope !== this.props.scope) {
      this.props.loadSchema(this.props.scope, 'search-result', 'json')
      this.props.loadSchema(this.props.scope, 'search-form', 'json')
      this.props.setQueryText('')
      this.props.setAdvancedQuery({})
      this.props.clearFilters()
      this.props.runSearch(this.props.stagedSearch, { type: this.props.match.params.type, scope: this.props.scope })
    }

    // this.props.loadSchema(this.props.scope, 'search-result', 'json')
    // this.props.loadSchema(this.props.scope, 'search-form', 'json')

  }

  search = () => {
    if (this.props.stagedSearch.page == 1) {
      this.props.runSearch(this.props.stagedSearch, { type: this.props.match.params.type, scope: this.props.scope });
    } else {
      this.props.changePage(1);
    }
  }

  render = () => {

    return React.createElement(
      Row,
      null,
      React.createElement(
        Col,
        { md: 3, style: {
          padding: '0 15px'
        }},
        React.createElement(Facets, {
          availableFilters: this.props.facets,
          activeFilters: this.props.activeFilters,
          addFilter: this.props.addFilter,
          removeFilter: this.props.removeFilter
        })
      ),
      React.createElement(
        Col,
        { md: 9 },
        React.createElement(
          Row,
          null,
          React.createElement(SearchBar, {
            queryText: this.props.queryText,
            setQueryText: this.props.setQueryText,
            advancedQuery: this.props.advancedQuery,
            setAdvancedQuery: this.props.setAdvancedQuery,
            activeFilters: this.props.activeFilters,
            onSearchExecute: this.search,
            onClearSearchResults: this.clearSearchResults,
            clearFilters: this.props.clearFilters,
            setFilters: this.props.setFilters,
            searchResultSchema: this.props.searchResultSchema,
            searchFormSchema: this.props.searchFormSchema,
          })
        ),
        this.props.isSearchComplete || this.props.isSearchPending ? React.createElement(
          Fade,
          { 'in': this.props.isSearchComplete, appear: true },
          React.createElement(SearchResponseView, {
            error: this.props.error,
            results: this.props.results,
            executionTime: this.props.executionTime,
            total: this.props.total,
            page: this.props.page,
            totalPages: this.props.totalPages,
            handlePageSelection: this.handlePageSelection,
            detailPath: this.props.detailPath,
            message: this.props.message,
            // resultComponent: this.state.resultComponent,
            isSearchPending: this.props.isSearchPending,
            displayMode: this.props.displayMode,
            setDisplayMode: this.props.setDisplayMode,
            searchForSimilar: this.props.searchForSimilar,
            addBookmark: this.props.addBookmark,
            removeBookmark: this.props.removeBookmark,
            history: this.props.history,
            type: this.props.match.params.type,
            searchResultSchema: this.props.searchResultSchema,
            searchFormSchema: this.props.searchFormSchema,
          })
        ) : React.createElement(
          'p',
          null,
          'Please click Search to find results.'
        )
      )
    )
  }
}

SearchView.propTypes = process.env.NODE_ENV !== "production" ? {
  // TODO: flesh out which are required
  // TODO: group together some of these, perhaps back to what is returned from
  // selectors, like stagedSearch and searchResponse
  stagedSearch: PropTypes.object.isRequired,
  queryText: PropTypes.string.isRequired,
  setQueryText: PropTypes.func.isRequired,
  advancedQuery: PropTypes.object,
  setAdvancedQuery: PropTypes.func.isRequired,
  clearSearchResults: PropTypes.func,
  runSearch: PropTypes.func.isRequired,
  error: PropTypes.string,
  results: PropTypes.array, // TODO: say more about shape of this
  executionTime: PropTypes.number,
  total: PropTypes.number,
  page: PropTypes.number,
  totalPages: PropTypes.number,
  isSearchComplete: PropTypes.bool,
  isSearchPending: PropTypes.bool,
  changePage: PropTypes.func,
  detailPath: PropTypes.string,
  addBookmark: PropTypes.func,
  removeBookmark: PropTypes.func,

  // TODO: rename facets => availableFilters?
  facets: PropTypes.object,
  activeFilters: PropTypes.array.isRequired,
  addFilter: PropTypes.func.isRequired,
  removeFilter: PropTypes.func.isRequired,
  clearFilters: PropTypes.func,
  setFilters: PropTypes.func.isRequired,

  displayMode: PropTypes.string,
  setDisplayMode: PropTypes.func,

  bookmarkPending: PropTypes.bool
} : {};

export default SearchView;