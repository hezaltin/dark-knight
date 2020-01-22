import React from 'react'
import PropTypes from 'prop-types'
import { Col, FormGroup, FormControl, InputGroup, Glyphicon, Button, Modal } from 'react-bootstrap'
import Form from 'react-jsonschema-form'
import { isEmpty } from 'lodash'
// import fields from "react-jsonschema-form-extras"
import './SearchBar.css'
import { DatePickerField, ConstraintSelectorField, AsyncConstraintSelectorField } from '../../libs/JsonSchemaForm'

const fields = {
  DatePickerField,
  ConstraintSelectorField,
  AsyncConstraintSelectorField,
}

class SearchBar extends React.Component {

  constructor(props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onClear = this.onClear.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.toggleAdvancedSearch = this.toggleAdvancedSearch.bind(this)
    this.compileAdvancedSearchFormData = this.compileAdvancedSearchFormData.bind(this)
    this.updateBasedOnAdvancedSearchFormData = this.updateBasedOnAdvancedSearchFormData.bind(this)
    this.state = {
      advancedSearch: false
    }
  }

  componentDidMount() {
    // This is workaround to kick off search once a user log in
    // However it does run every time user navigates back to search route (e.g. from detail),
    // although no duplicate http search request is being made.
    if (!this.props.queryText) {
      this.props.onSearchExecute()
    }
  }

  onSubmit(e) {
    e.preventDefault()
    this.props.onSearchExecute()
    this.setState({
      advancedSearch: false
    })
  }

  onChange(e) {
   this.props.setQueryText(e.target.value)
  }

  onClear() {
    this.props.clearFilters()
    this.props.setQueryText('')
    this.setState({
      advancedSearch: false
    })
    this.props.setAdvancedQuery({})
  }

  toggleAdvancedSearch() {
    this.setState({
      advancedSearch: !this.state.advancedSearch
    })
  }

  handleClose() {
    this.setState({
      advancedSearch: false
    })
  }

  compileAdvancedSearchFormData() {
    const advancedQuerySection = this.props.advancedQuery
    const termMap = { and: 'includes', not: 'excludes' }
    const activeFilterSection = (this.props.activeFilters || [])
      .reduce((allFilters, curFilter) => {
        if (!allFilters[curFilter.constraint]) {
          allFilters[curFilter.constraint] = {
            'includes': [],
            'excludes': []
          }
        }
        allFilters[curFilter.constraint][termMap[curFilter.mode]] = curFilter.value
        return allFilters
      }, {})
    const formData = {
      ...advancedQuerySection, 
      ...activeFilterSection,
      anywhere: this.props.queryText,
    }
    return formData
  }

  updateBasedOnAdvancedSearchFormData(update) {
    const {formData, schema} = update

    const queryText = formData.anywhere || ''
    this.props.setQueryText(queryText)

    const newAdvancedQuery = Object.keys(formData)
      .map(key => ({
        key,
        spec: schema.properties[key],
        value: formData[key]
      }))
      .filter(({key, spec}) => {
        if (!spec) {
          console.log({key, formData, schema})
        }
        return (spec['brain:search'] && spec['brain:search']['brain:searchType'] === 'text')
      })
      .reduce((all, {key, value}) => {
        all[key] = value
        return all
      }, {})
    this.props.setAdvancedQuery(newAdvancedQuery)

    const newActiveFilters = Object.keys(formData)
      .map(key => ({
        key,
        spec: schema.properties[key],
        value: formData[key]
      }))
      .filter(({key, spec}) => {
        const filterTypes = ['custom', 'bucketed', 'range']
        return spec && spec['brain:search'] && 
          filterTypes.includes(spec['brain:search']['brain:searchType'])
      })
      .reduce((all, {key, spec, value}) => {
        if (value.includes) {
          all.push({
            constraint: key, constraintType: spec['brain:search']['brain:searchType'], mode: "and", type: "selection", value: value.includes || []
          })
        }
        if (value.excludes) {
          all.push(          {
            constraint: key, constraintType: spec['brain:search']['brain:searchType'], mode: "not", type: "selection", value: value.excludes || []
          })
        }
        return all
      }, [])
    this.props.setFilters(newActiveFilters)
    // console.log(JSON.stringify({update: update.dataForm, newAdvancedQuery, newActiveFilters}))
  }

  render() {   
    const props = this.props

    if (!props.searchFormSchema) {
      return null
    }
    const formData = this.compileAdvancedSearchFormData()

    const {dataSchema, uiSchema} = props.searchFormSchema
 
    // Object.entries(dataSchema.properties).forEach(([key, value]) => {
    //   const searchType = value['brain:search'] && value['brain:search']['brain:searchType']
    //   switch (searchType) {
    //     case 'custom-bucket': {
    //       uiSchema[key] = {
    //         "ui:field": "ConstraintSelectorField",
    //         constraintSelector: {
    //           "options": value['brain:search']['brain:searchEnum'],
    //           "minLength": 0,
    //         }
    //       }
    //       break
    //     }
    //     case 'value-lexicon': {
    //       uiSchema[key] = {
    //         "ui:field": "AsyncConstraintSelectorField",
    //         asyncConstraintSelector: { 
    //           url: "/api/value/typeahead-lexicon-values",
    //           method: "POST",
    //           data: {
    //             range: value['brain:search']['brain:searchPath']
    //           },
    //           optionsPath: "results",
    //           labelKey: "value",
    //           minLength: 0,
    //         }
    //       }
    //       break
    //     }
    //   }
    // })


    return <Col md={12} className="ml-search-bar" style={{position: 'relative'}}>
      <form role="search" onSubmit={this.onSubmit}>
        <FormGroup controlId="search-box" style={{marginBottom: '5px'}}>
          <InputGroup>
            <div style={{position: 'relative'}}>
              <Button bsStyle="link" 
                onClick={this.toggleAdvancedSearch}
                style={{
                  position: 'absolute', right: 0, zIndex: 1000, textDecoration: 'none',
                  color: '#b1b1b1', fontWeight: 200, 
                  visibility: this.state.advancedSearch ? 'hidden' : 'visible'
                }}>
                { this.state.advancedSearch ? '' : 'Switch to advanced search'}
              </Button>
              <FormControl autoComplete='off' className="ml-qtext-input" type="text" placeholder="Search..." 
                value={props.queryText} onChange={this.onChange}>
              </FormControl>
            </div>
            <InputGroup.Button>
              <Button className="ml-execute-search btn-raised" disabled={props.searchPending} type="submit">
                <Glyphicon glyph='search' style={{marginRight: '4px'}}></Glyphicon>
                Search
              </Button>
              <Button className="ml-qtext-clear btn-raised" onClick={this.onClear}>
                <Glyphicon glyph='remove' style={{marginRight: '4px'}}></Glyphicon>
                Clear
              </Button>
            </InputGroup.Button>
          </InputGroup>
        </FormGroup>
      </form>
      {/* <div className="advanced-query">
        {
          isEmpty(this.props.advancedQuery) && this.props.uiSchema && 
          this.props.uiSchema.form.ui.order.map((keyword, index) => {
            
            return <>{this.props.uiSchema.form.data.properties[keyword].title}:
              <span key={`advanced-query-${keyword}-${index}`}>{this.props.advancedQuery[keyword]}</span>
            </>
          })
        }
      </div> */}
      {
        props.suggestions &&
        <div style={{ 
          position: 'absolute', background: 'white', zIndex: 100, boxShadow: '0px 10px 10px rgba(0,0,0,.35)',
          left: '15px', right: '15px', padding: '12px 15px 0', marginTop: '-15px'
        }}>
          <p>This is the future search suggestion panel.</p>
        </div>
      }
      {
        <Modal show={this.state.advancedSearch} onHide={this.handleClose} bsSize="large">
          <Modal.Header closeButton>
            <Modal.Title>Advanced Search</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* <Form
              fields={fields}
              schema={dataSchema}
              uiSchema = {uiSchema}
              formData={formData}
              onChange={({formData}) => {
                props.setQueryText(formData.anywhere || '')
                const advancedQuery = Object.fromEntries(
                  Object.entries(formData).filter(
                     ([key, val]) => key !== 'anywhere'
                  )
                )
                props.setAdvancedQuery(advancedQuery)
              }}
              >
              <div />
            </Form> */}
            <Form
              fields={fields}
              schema={dataSchema}
              uiSchema={uiSchema}
              formData={formData}
              onChange={this.updateBasedOnAdvancedSearchFormData}
            >
              <div />
            </Form>
            <FormGroup>
            <InputGroup.Button>
              <Button className="ml-execute-search btn-raised" style={{marginRight: '20px', width: '90px'}} disabled={props.searchPending} onClick={this.onSubmit}>
                <Glyphicon glyph='search' style={{marginRight: '4px'}}></Glyphicon>
                Search
              </Button>
              <Button className="ml-qtext-clear btn-raised" style={{width: '90px'}} onClick={this.onClear}>
                <Glyphicon glyph='remove' style={{marginRight: '4px'}}></Glyphicon>
                Clear
              </Button>
            </InputGroup.Button>
            </FormGroup>
            {/* <pre>{JSON.stringify(formData, null, 2)}</pre> */}
          </Modal.Body>
        </Modal>
      }
    </Col>
  }
}

SearchBar.propTypes = process.env.NODE_ENV !== "production" ? {
  queryText: PropTypes.string.isRequired,
  setQueryText: PropTypes.func,
  onSearchExecute: PropTypes.func,
  onSubmit: PropTypes.func,
  onClearSearchResults: PropTypes.func,
  placeholder: PropTypes.string,
  searchPending: PropTypes.bool,
  setFilters: PropTypes.func,
} : {};

export default SearchBar
