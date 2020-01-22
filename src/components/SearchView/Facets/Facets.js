import React from 'react';
import PropTypes from 'prop-types';

import CurrentFilters from './CurrentFilters';
import SingleFilterList from './SingleFilterList';
import FacetSearch from './FacetSearch'

class Facets extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const activeFilters = this.props.activeFilters
    const availableFilters = this.props.availableFilters
    const addFilter = this.props.addFilter
    const removeFilter = this.props.removeFilter

    const currentFilters = activeFilters.length > 0 && 
      <CurrentFilters filters={activeFilters} removeFilter={removeFilter}/>

    const facets = availableFilters && 
     Object.keys(availableFilters).filter(facetName => availableFilters[facetName].facetValues) || []
    const facetPanels = facets.map((facetName, i) => {
      var selectedValues = void 0;
      var matchedActiveFilters = activeFilters.filter(filter => filter.constraint === facetName)
      if (matchedActiveFilters) {
        selectedValues = matchedActiveFilters.map(x => x.value).flat();
        selectedValues = [...new Set(selectedValues)]
      }
      return <div key={facetName} className="panel panel-primary ml-facet">
        <div className="panel-heading" style={{position: 'relative'}}>
          <FacetSearch></FacetSearch>
          <h3 className='panel-title'>{ facetName.replace(/_/g, ' ') }</h3>
        </div>
        <div className='panel-body'>
          <SingleFilterList
            values={availableFilters[facetName].facetValues}
            selectedValues={selectedValues}
            addFilter={addFilter.bind(null, facetName, availableFilters[facetName].type || null)}
            removeFilter={removeFilter.bind(null, facetName)}
          ></SingleFilterList>
        </div>
      </div>
    })

    return <div className="ml-facet-list list-group">
      { currentFilters }
      { facetPanels }
    </div>
  }
}

Facets.propTypes = process.env.NODE_ENV !== "production" ? {
  activeFilters: PropTypes.array.isRequired,
  addFilter: PropTypes.func.isRequired,
  availableFilters: PropTypes.object,
  removeFilter: PropTypes.func.isRequired
} : {};

export default Facets;