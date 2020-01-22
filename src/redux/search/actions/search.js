/* global require */
import * as bareTypes from '../actionTypes'

// TODO: remove /api/search? or just make it the actual defaultAPI below
// import searchAPI from './api/search'
require('isomorphic-fetch')

const defaultAPI = {
  search: searchQuery => {
    const url = new URL('/api/search/product', document.baseURI).toString()
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin',
      body: JSON.stringify({
        ...searchQuery,
        queryText: undefined,
        filters: {
          and: [
            {
              type: 'queryText',
              value: searchQuery.queryText
            },
            {
              type: 'advancedQuery',
              value: searchQuery.advancedQuery
            },
            ...(searchQuery.filters.filter(x => x.mode === 'and') || [])
          ],
          not: searchQuery.filters.filter(x => x.mode === 'not') || []
        }
      })
    }).then(response => {
      if (!response.ok) {
        return response.json().then(error => {
          throw new Error(error.message)
        })
      }
      return response.json()
    })
  }
}

const apiByType = (type, scope) => {
  return {
    search: searchQuery => {
      // type= 'product'
      return fetch(new URL(`/api/search/${type}?scope=${scope}`, document.baseURI).toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          ...searchQuery,
          queryText: undefined,
          filters: {
            and: [
              {
                type: 'queryText',
                value: searchQuery.queryText
              },
              {
                type: 'advancedQuery',
                value: searchQuery.advancedQuery
              },
              ...(searchQuery.filters.filter(x => x.mode === 'and') || [])
            ],
            not: searchQuery.filters.filter(x => x.mode === 'not') || []
          }
        })
      }).then(response => {
        if (!response.ok) {
          return response.json().then(error => {
            throw new Error(error.message);
          });
        }
        return response.json();
      });
    }
  }
};


export default config => {
  let types = bareTypes;
  if (config && config.namespace) {
    types = Object.keys(types).reduce((newTypes, typeKey) => {
      newTypes[typeKey] = config.namespace + '/' + types[typeKey];
      return newTypes;
    }, {});
  }

  const receiveSuccessfulSearch = (response, optionalArgs) => ({
    type: types.SEARCH_SUCCESS,
    payload: { response, ...optionalArgs }
  });

  const runSearch = (searchQuery, optionalArgs = {}) => {
    // let searchAPI = defaultAPI;
    // if (optionalArgs.api) {
    //   searchAPI = optionalArgs.api;
    //   delete optionalArgs.api;
    // }

    // if (optionalArgs.type) {
    //   searchAPI = apiByType(optionalArgs.type)
    //   delete optionalArgs.type
    // }

    const searchAPI = apiByType(optionalArgs.type, optionalArgs.scope)
    delete optionalArgs.type

    return dispatch => {
      dispatch({
        type: types.SEARCH_REQUESTED,
        payload: { query: searchQuery, ...optionalArgs }
      });

      // TODO: consider changing shape of state instead of modifying
      // shape of query here
      const { page, pageLength, ...groveSearchQuery } = searchQuery

      return searchAPI
        .search(
          {
            ...groveSearchQuery,
            options: {
              start:
                pageLength && page ? pageLength * (page - 1) + 1 : undefined,
              pageLength: pageLength,
            }
          },
          optionalArgs
        )
        .then(
          data => dispatch(receiveSuccessfulSearch(data, optionalArgs)),
          error => {
            dispatch({
              type: types.SEARCH_FAILURE,
              payload: { error: error.message, ...optionalArgs }
            });
          }
        );
    };
  };

  const clearSearchResults = (optionalArgs = {}) => ({
    type: types.CLEAR_SEARCH_RESULTS,
    payload: { ...optionalArgs }
  })

  // const suggest = (queryText) => {
  //   return (dispatch, getState) => {
  //     dispatch({ type: types.SUGGEST_REQUESTED, payload: queryText })

  //     let state = getState().search
  //     let query = qb.ext.combined(constraintQuery(state.constraints), state.queryText)

  //     return client.suggest(state.suggestQueryText, query, { options: 'all' })
  //       .then(response => {
  //         if (!response.ok) throw new Error('bad search')
  //         return response.json()
  //       })
  //       .then(
  //         response => dispatch({ type: types.SUGGEST_SUCCESS, payload: response }),
  //         response => dispatch({ type: types.SUGGEST_FAILURE, payload: response }),
  //       )
  //   }
  // }

  // const options = () => {
  //   return dispatch => {
  //     dispatch({ type: types.OPTIONS_REQUESTED })

  //     return client.options('all')
  //     // !response.ok?
  //       .then(response => response.json())
  //       .then(response => {
  //         if (!(response && response.options)) throw new TypeError('invalid options')
  //         return response
  //       })
  //       .then(
  //         response => dispatch({ type: types.OPTIONS_SUCCESS, payload: response }),
  //         response => dispatch({ type: types.OPTIONS_FAILURE, payload: response })
  //       )
  //   }
  // }

  const setQueryText = queryText => {
    return {
      type: types.SET_QUERYTEXT,
      payload: { queryText }
    }
  }

  const setAdvancedQuery = advancedQuery => {
    return {
      type: types.SET_ADVANCED_QUERY,
      payload: { advancedQuery }
    }
  }

  const changePage = n => {
    return { type: types.CHANGE_PAGE, payload: { page: n } }
  }

  // const pageLength = (l) => {
  //   return dispatch => {
  //     dispatch({ type: types.PAGE_LENGTH, payload: l })
  //     return dispatch(runSearch())
  //   }
  // }

  const addFilter = (constraint, constraintType, values, optional = {}) => {
    values = values instanceof Array ? values : [values];
    return {
      type: types.ADD_FILTER,
      payload: {
        constraint,
        constraintType: constraintType || undefined,
        values,
        boolean: optional.boolean || 'and'
      }
    }
  }

  const removeFilter = (constraint, values, optional = {}) => {
    values = values instanceof Array ? values : [values];
    return {
      type: types.REMOVE_FILTER,
      payload: { constraint, values, boolean: optional.boolean || 'and' }
    }
  }

  const clearFilters = (constraint, optional = {}) => ({
    type: types.CLEAR_FILTERS,
    payload: { constraint, ...optional }
  })

  const setFilters = (filters) => {
    return {
      type: types.SET_FILTERS,
      payload: { filters }
    }
  }
  
  const replaceFilter = (constraint, constraintType, values, optional = {}) => {
    // TODO: DRY UP with addFilter?
    values = values instanceof Array ? values : [values];
    return {
      type: types.REPLACE_FILTER,
      payload: {
        constraint,
        constraintType: constraintType || undefined,
        values,
        boolean: optional.boolean || 'and'
      }
    }
  }

  const setDisplayMode = mode => ({
    type: types.SET_DISPLAY_MODE,
    payload: { mode }
  });

  const updateSearchResult = (uri, update) => ({
    type: types.ADD_RESULT_BOOKMARK,
    payload: { uri, update }
  })

  // Create a search query based on a document extract
  const searchForSimilar = (extract) => {
    const query = [
      extract.keywords.map(x => `"${x.name}"`).join(' OR '),
    ] 
    const constraints = [
      extract.businesses.map(x => `Business_Unit:"${x.name}"`).join(' OR '),
      extract.authors.map(x => `Author:"${x.name}"`).join(' OR '),
    ]
    const docId = extract.docId
    const queryText = `(${query.join(' OR ')}) AND (${constraints.join(' OR ')}) AND -DocID:"${docId}"`

    return dispatch => { 
      dispatch(clearFilters())
      dispatch(setQueryText(queryText))

    }
  }


  return {
    runSearch,
    receiveSuccessfulSearch,
    setQueryText,
    setAdvancedQuery,
    changePage,
    addFilter,
    removeFilter,
    setFilters,
    replaceFilter,
    clearFilters,
    clearSearchResults,
    setDisplayMode,
    updateSearchResult,
    searchForSimilar,
  };
};
