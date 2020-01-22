import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Pagination, Checkbox, DropdownButton, Dropdown, MenuItem, Alert } from 'react-bootstrap';

import SearchResults from './SearchResults/SearchResults';
import SearchMetrics from './SearchMetrics';
import './SearchResponseView.css'

class SearchResponseView extends React.Component {
  constructor(props) {
    super(props)
    this.selectDisplayMode = this.selectDisplayMode.bind(this)

    this.state = { 
      resultComponentName: null,
      uiSchema: null 
    }
    
  }

  componentDidUpdate = (prevProps) => {   
    // Switch result component
    if (
      !!this.props.searchResultSchema // data schema must exist
      && 
      ( 
        !prevProps.searchResultSchema // prep data schema not exist
        || 
        prevProps.searchResultSchema.dataSchema.properties['__type__'].const !== this.props.searchResultSchema.dataSchema.properties['__type__'].const // schema has updated
    )) {
      const compactUiSchema = this.props.searchResultSchema.uiSchema.compact
      // console.log('schema update', compactUiSchema.widget)
      this.setState({ 
        uiSchema: compactUiSchema,
        resultComponentName: compactUiSchema.widget 
      })
    }
  }

  selectDisplayMode = (key) => {
    this.props.setDisplayMode(key)
  }

  

  render() {
    const props = this.props
    if(!props.searchResultSchema || !props.displayMode) {
      return null
    }

    const {dataSchema, uiSchema} = props.searchResultSchema
    const displayModeKeys = Object.keys(uiSchema).filter(key => uiSchema[key] !== null)
    return React.createElement(
      Row,
      null,
      React.createElement(
        Col,
        { md: 12 },
        React.createElement(
          Row,
          null,
          props.error ? React.createElement(
            Col,
            { md: 12 },
            React.createElement(
              'p',
              null,
              React.createElement(
                'strong',
                null,
                'There was an error performing your search.'
              )
            ),
            React.createElement(
              'p',
              null,
              'The server sent the following error message:\xA0',
              React.createElement(
                'span',
                { className: 'text-danger' },
                props.error
              )
            )
          ) : !props.isSearchPending && React.createElement(
            'div',
            null,
            <Row style={{padding: '0 15px'}}>
              <Col md={12}>
                <div style={{float: 'right'}} className='display-mode-menu'>
                  <span style={{marginRight: '8px'}}>Display Mode:</span>
                  <DropdownButton
                    pullRight
                    bsSize="xsmall"
                    style={{background: '#eee', border: 'none', color: '#666'}}
                    title={uiSchema[props.displayMode].title}
                    id="display-mode-menu" 
                  >
                    {
                      displayModeKeys.map((key, i) => {
                        const value = uiSchema[key]
                        return <MenuItem bsSize="xsmall" title={value.description} 
                          eventKey={key} key={`display-model-${key}`}
                          active={key === props.displayMode}
                          disabled={key === props.displayMode}
                          onSelect={eventKey => this.selectDisplayMode(eventKey)}
                        >{value.title}</MenuItem>
                      })
                    }
                  </DropdownButton>
                </div>
                <SearchMetrics time={props.executionTime} total={props.total}></SearchMetrics>
              </Col>
            </Row>,
            this.props.message === 'update' && <Row style={{padding: '0 15px'}}>
              <Alert bsStyle="warning" style={{margin: '8px 15px 4px', padding: '8px 15px'}}>
                <strong>How to edit a result:</strong> Open the option menu (three dots button) to the right of each result and select "Edit" in the dropdown menu.
              </Alert>
            </Row>,           
              // <Checkbox style={{float: 'right'}} className="displya-mode-toggle" checked={props.displayMode === 'expanded'}
              //   inline title='Expanded Mode' onChange={(event) => { 
              //   props.setDisplayMode(event.target.checked ? 'expanded' : 'compact') 
              // }}>Expanded Mode</Checkbox>
            React.createElement(SearchResults, {
              results: props.results || [],
              detailPath: props.detailPath,
              resultComponentName: this.state.resultComponentName,
              displayMode: props.displayMode,
              setDisplayMode: props.setDisplayMode,
              searchForSimilar: props.searchForSimilar,
              addBookmark: props.addBookmark,
              removeBookmark: props.removeBookmark,
              history: props.history,
              type: props.type,
              searchResultSchema: props.searchResultSchema
            }),
            props.totalPages > 1 && React.createElement(
              Col,
              { md: 12 },
              React.createElement(Pagination, {
                items: props.totalPages,
                maxButtons: 10,
                boundaryLinks: true,
                activePage: props.page,
                onSelect: props.handlePageSelection,
              })
            )
          )
        )
      )
    );
  }
}

SearchResponseView.propTypes = process.env.NODE_ENV !== "production" ? {
  error: PropTypes.string,
  results: PropTypes.array,
  executionTime: PropTypes.number,
  total: PropTypes.number,
  page: PropTypes.number,
  totalPages: PropTypes.number,
  handlePageSelection: PropTypes.func,
  displayMode: PropTypes.string,
  setDisplayMode: PropTypes.func,
  bookmarkPending: PropTypes.bool,
  addBookmark: PropTypes.func,
  removeBookmark: PropTypes.func,
  searchForSimilar: PropTypes.func,
  clearFilters: PropTypes.func,
} : {};

export default SearchResponseView;