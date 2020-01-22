import React from 'react';
import PropTypes from 'prop-types';

class SingleFilterList extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const _this2 = this
    return React.createElement(
      'div',
      null,
      // this.props.selectedValues && React.createElement(
      //   'div',
      //   { className: 'selectedFilterValues' },
      //   this.props.values.map(function (value) {
      //     return _this2.props.selectedValues.includes(value.name) && React.createElement(
      //       'div',
      //       { key: value.name },
      //       _this2.props.removeFilter && React.createElement('span', {
      //         className: 'glyphicon glyphicon-remove-circle icon-white ml-facet-remove-filter',
      //         onClick: _this2.props.removeFilter.bind(null, value.name),
      //         style: { cursor: 'pointer' }
      //       }),
      //       React.createElement(
      //         'span',
      //         { title: value.name },
      //         ' ',
      //         value.value
      //       ),
      //       React.createElement(
      //         'span',
      //         null,
      //         ' (',
      //         value.count,
      //         ')'
      //       )
      //     );
      //   })
      // ),
      <div className='nonSelectedFilterValues'>
        {
          this.props.values.map(value => {
            if (_this2.props.selectedValues && _this2.props.selectedValues.includes(value.name)) {
              return null
            }
            
            const facetSplit = value.name.split('/')
            const facetType = facetSplit[0]
            const facetValue = facetSplit.length > 1 && facetType === 'rating' && parseInt(facetSplit[1])
            const facetLabel = facetType === 'rating' ?
              <span title={value.name}> { '★'.repeat(facetValue) + '☆'.repeat(5-facetValue) }</span> :
              <span title={value.name}> { value.value }</span>
            return <div key={value.name} className="filterValue">
                { facetLabel }
                {/* <span title={value.name}> { value.value }</span> */}
                <span> ({ value.count })</span>
                <div className="selector">
                  <i className="glyphicon glyphicon-plus-sign ml-facet-add-pos"
                    style={{ cursor: 'pointer', color: '#469408', marginRight: '2px'  }}
                    onClick={_this2.props.addFilter.bind(null, value.name, {boolean: 'and'})}
                    ></i>
                  <i className="glyphicon glyphicon-minus-sign ml-facet-add-neg"
                    style={{ cursor: 'pointer', color: '#d9230f'  }}
                    onClick={_this2.props.addFilter.bind(null, value.name, {boolean: 'not'})}
                    ></i>
                </div>
              </div>
          })
        }
      </div>
      // React.createElement(
      //   'div',
      //   { className: 'nonSelectedFilterValues' },
      //   this.props.values.map(function (value) {
      //     return (!_this2.props.selectedValues || !_this2.props.selectedValues.includes(value.name)) && React.createElement(
      //       'div',
      //       { key: value.name },
      //       React.createElement('i', {
      //         className: 'glyphicon glyphicon-plus-sign ml-facet-add-pos',
      //         onClick: _this2.props.addFilter.bind(null, value.name),
      //         style: { cursor: 'pointer', color: '#469408'  }
      //       }),
      //       React.createElement('i', {
      //         className: 'glyphicon glyphicon-minus-sign ml-facet-add-neg',
      //         onClick: _this2.props.addFilter.bind(null, value.name),
      //         style: { cursor: 'pointer', color: '#d9230f' }
      //       }),
      //       React.createElement(
      //         'span',
      //         { title: value.name },
      //         ' ',
      //         value.value
      //       ),
      //       React.createElement(
      //         'span',
      //         null,
      //         ' (',
      //         value.count,
      //         ')'
      //       )
      //     );
      //   })
      // )
    );
  }
}

// var SingleFilterList = function SingleFilterList(_ref) {
//   var values = _ref.values,
//       selectedValues = _ref.selectedValues,
//       addFilter = _ref.addFilter,
//       removeFilter = _ref.removeFilter;
//   return React.createElement(
//     'div',
//     null,
//     selectedValues && React.createElement(
//       'div',
//       { className: 'selectedFilterValues' },
//       values.map(function (value) {
//         return selectedValues.includes(value.name) && React.createElement(
//           'div',
//           { key: value.name },
//           removeFilter && React.createElement('span', {
//             className: 'glyphicon glyphicon-remove-circle icon-white ml-facet-remove-filter',
//             onClick: removeFilter.bind(null, value.name),
//             style: { cursor: 'pointer' }
//           }),
//           React.createElement(
//             'span',
//             { title: value.name },
//             ' ',
//             value.value
//           ),
//           React.createElement(
//             'span',
//             null,
//             ' (',
//             value.count,
//             ')'
//           )
//         );
//       })
//     ),
//     React.createElement(
//       'div',
//       { className: 'nonSelectedFilterValues' },
//       values.map(function (value) {
//         return (!selectedValues || !selectedValues.includes(value.name)) && React.createElement(
//           'div',
//           { key: value.name },
//           React.createElement('i', {
//             className: 'glyphicon glyphicon-plus-sign ml-facet-add-pos',
//             onClick: addFilter.bind(null, value.name),
//             style: { cursor: 'pointer' }
//           }),
//           React.createElement(
//             'span',
//             { title: value.name },
//             ' ',
//             value.value
//           ),
//           React.createElement(
//             'span',
//             null,
//             ' (',
//             value.count,
//             ')'
//           )
//         );
//       })
//     )
//   );
// };

SingleFilterList.propTypes = process.env.NODE_ENV !== "production" ? {
  values: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    count: PropTypes.number
  })).isRequired,
  selectedValues: PropTypes.array,
  addFilter: PropTypes.func.isRequired,
  removeFilter: PropTypes.func
} : {};

export default SingleFilterList;