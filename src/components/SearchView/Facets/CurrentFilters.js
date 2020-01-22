import React from 'react';
import PropTypes from 'prop-types';

import TransitionGroup from 'react-transition-group/TransitionGroup';
import Fade from '../../animations/Fade';

import { some } from 'lodash';

// TODO: truncate values with a truncateLength option
var CurrentFilters = function CurrentFilters(_ref) {
  var filters = _ref.filters,
      removeFilter = _ref.removeFilter;
  const includedFilters = filters.filter(f => f.mode==='and')
  const excludedFilters = filters.filter(f => f.mode==='not')
  const displayIncluded = (includedFilters && includedFilters.length > 0) ? 'block' : 'none'
  const displayExcluded = (excludedFilters && excludedFilters.length > 0) ? 'block' : 'none'
  return React.createElement(
    'div',
    { className: 'chiclets', style: { marginBottom: '10px' } },
    <h4 style={{fontSize: '12px', margin: '0', display: displayIncluded}}>Includes</h4>,
    includedFilters.map(function (filter) {
      if (some(filter.value, function (value) {
        return !(typeof value === 'string' || typeof value === 'number');
      })) {
        return null;
      }
      return (
        // <div ng-repeat="(index, facet) in facets | object2Array | filter:{selected: true}">
        React.createElement(
          Fade,
          { key: filter.constraint },
          React.createElement(
            'div',
            {
              // style: { marginBottom: '10px' },
              className: 'grove-current-filter'
            },
            filter.value.map(function (value) {
              const facetSplit = value.split('/')
              const facetType = facetSplit[0]
              const facetValue = facetSplit.length > 1 && facetType === 'rating' && parseInt(facetSplit[1])
              const facetLabel = facetType === 'rating' ? '★'.repeat(facetValue) + '☆'.repeat(5-facetValue) : value
              return React.createElement(
                'div',
                {
                  key: filter.constraint + value,
                  className: 'btn btn-success btn-raised',
                  onClick: removeFilter.bind(null, filter.constraint, value, {boolean: filter.mode || 'and'})
                },
                React.createElement('span', { className: 'glyphicon glyphicon-remove-circle icon-white' }),
                React.createElement(
                  'span',
                  { title: value },
                  filter.constraint.replace('_', ' '),
                  ': ',
                  facetLabel,
                  ' '
                ),
              );
            })
          )
        )
      );
    }),
    <h4 style={{fontSize: '12px', margin: '0', display: displayExcluded}}>Excludes</h4>,
    // <h4>Excludes</h4>,
    excludedFilters.map(function (filter) {
      if (some(filter.value, function (value) {
        return !(typeof value === 'string' || typeof value === 'number');
      })) {
        return null;
      }
      return (
        // <div ng-repeat="(index, facet) in facets | object2Array | filter:{selected: true}">
        React.createElement(
          Fade,
          { key: filter.constraint },
          React.createElement(
            'div',
            {
              // style: { marginBottom: '10px' },
              className: 'grove-current-filter'
            },
            filter.value.map(function (value) {
              return React.createElement(
                'div',
                {
                  key: filter.constraint + value,
                  className: 'btn btn-danger btn-raised',
                  onClick: removeFilter.bind(null, filter.constraint, value, {boolean: filter.mode || 'and'})
                },
                React.createElement('span', { className: 'glyphicon glyphicon-remove-circle icon-white' }),
                React.createElement(
                  'span',
                  { title: value },
                  filter.constraint.replace('_', ' '),
                  ': ',
                  value,
                  ' '
                ),
              );
            })
          )
        )
      );
    })
  );
};

CurrentFilters.propTypes = process.env.NODE_ENV !== "production" ? {
  filters: PropTypes.array.isRequired,
  removeFilter: PropTypes.func.isRequired
} : {};

export default CurrentFilters;