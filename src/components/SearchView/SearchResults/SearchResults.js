import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, ButtonToolbar, ToggleButtonGroup, ToggleButton, Checkbox } from 'react-bootstrap';
import CardResult from './Result/CardResult';
import ListResult from './Result/ListResult';

const DefaultNoResults = () => {
  return React.createElement(
    Col,
    { md: 12 },
    React.createElement(
      'p',
      null,
      React.createElement('br', null),
      React.createElement(
        'strong',
        null,
        'No results matched your search.'
      )
    )
  );
};

class SearchResults extends React.Component {
  constructor(props) {
    super(props)

    // var resultComponentName = props.resultComponent || 'List';

    let flexDirection = 'column'

    // if(resultComponentName=='Card'){
    //   resultComponent = CardResult
    //   flexDirection='row';
    // }else{

    //   resultComponent = ListResult
    //   flexDirection='column';
    // }
   
    this.state = {
      // resultComponentName: resultComponentName,
      resultComponent: ListResult,
      flexDirection: 'column',
    }
  }
  componentDidUpdate = (prevProps) => {

    if ((!prevProps.resultComponentName || !this.state.resultComponent) && this.props.resultComponentName) {
      switch (this.props.resultComponentName) {
        case 'card':
          return this.setState({
            resultComponent: CardResult
          })
        case 'list': 
        default: 
          return this.setState({
            resultComponent: ListResult
          })
      }

    }
  }

  // Not enabled
  // setResultType = (e) => {
  //   console.log('eeeeee=>',e)
  //   var resultComponent = void 0;
  //   if (e === 'Cards') {
  //     console.log('card result')
  //     resultComponent = CardResult;
  //   } else if (e === 'List') {
  //     console.log('list result')
  //     resultComponent = ListResult;
  //   } else {
  //     throw 'Invalid Result Type: ' + e;
  //   }
  //   this.setState({
  //     resultComponentName: e,
  //     resultComponent: resultComponent
  //   });
  // };

  render = () => {
    var _this2 = this
    let columnSize = this.state.columnSize
    let flexDirection = this.state.flexDirection
    const props = this.props
    if (!props.results || !props.searchResultSchema || !this.state.resultComponent) {
      // console.log({results: props.results, schema: props.searchResultSchema, comp: this.state.resultComponent})
      return null;
    }

    // For now, if you provide a resultComponent, we suppress the choice among
    // various types, though I could imagine letting the user specify > 1
    return React.createElement(
      'div',
      null,
      props.results.length > 0 && React.createElement(
        Col,
        { xs: 12, md: 6, style: { float: 'right' } },
        React.createElement(
          ButtonToolbar,
          { style: { float: 'right', marginBottom: '10px' } },
          // Disable toggle between list and card views
          // React.createElement(
          //   ToggleButtonGroup,
          //   {
          //     type: 'radio',
          //     name: 'result-options',
          //     value: this.state.resultComponentName,
          //     onChange: this.setResultType
          //   },
          //   React.createElement(
          //     ToggleButton,
          //     { value: 'List' },
          //     'List'
          //   ),
          //   React.createElement(
          //     ToggleButton,
          //     { value: 'Cards' },
          //     'Cards'
          //   )
          // )

          // Toggle between Abstract show/hide
          // <ToggleButtonGroup
          //   type='radio'
          //   name='toggle-abstract'
          //   value={this.state.value}
          //   onChange={this.toggleAbstract}
          // >
          //   <ToggleButton value={true}>Display</ToggleButton>
          //   <ToggleButton value={false}>Hide</ToggleButton>
          // </ToggleButtonGroup>,
          // <Checkbox style={{float: 'right'}} className="abstract-toggle" inline title='Display Abstract' onChange={() => { 
          //   this.setState({ displayAbstract: !this.state.displayAbstract })
          // }}>Display Abstract</Checkbox>
        )
      ),
      React.createElement(
        Row,
        { className: 'ml-search-results', style: {
          margin: 0
        } },
        React.createElement(
          Col,
          {
            md: 12, style: {
              display: 'flex',
              // justifyContent: 'space-evenly',
              flexWrap: 'wrap',
              flexDirection:this.state.flexDirection
            }
          },

          this.props.results.map(function (result) {
            return React.createElement(_this2.state.resultComponent, {
              key: result.uri,
              result: result,
              detailPath: _this2.props.detailPath || '/detail',
              displayMode: _this2.props.displayMode,
              addBookmark: _this2.props.addBookmark,
              removeBookmark: _this2.props.removeBookmark,
              searchForSimilar: _this2.props.searchForSimilar,
              history: _this2.props.history,
              type: _this2.props.type,
              searchResultSchema: props.searchResultSchema,
            });
          }),
          this.props.results.length === 0 && React.createElement(this.props.noResults, null)
        )
      )
    )
  }
}

SearchResults.defaultProps = {
  noResults: DefaultNoResults
}

SearchResults.propTypes = process.env.NODE_ENV !== "production" ? {
  resultComponent: PropTypes.string,
  noResults: PropTypes.func,
  results: PropTypes.arrayOf(PropTypes.shape({
    uri: PropTypes.string
  })).isRequired,
  detailPath: PropTypes.string,
  addBookmark: PropTypes.func,
  removeBookmark: PropTypes.func,
  searchForSimilar: PropTypes.func,
} : {};

export default SearchResults;