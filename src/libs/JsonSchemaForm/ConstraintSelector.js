import React, { Component } from "react"
import PropTypes from "prop-types"
import cx from 'classnames'
import selectn from "selectn"
import { Row, Col } from 'react-bootstrap'
import { AsyncTypeahead, Typeahead, Token } from "react-bootstrap-typeahead"
import {
  DEFAULT_OPTIONS,
  DEFAULT_ASYNC_OPTIONS,
  mapLabelKey,
  applyLabelKey,
  mapToSchema,
  toSelected,
  isValidFormData,
} from './TypeAhead-util'
import { DefaultLabel, Label } from "./Label"
import './ConstraintSelector.css'

class BaseConstraintSelectorField extends Component {
  constructor(props) {
    super(props)

    this.state = {
      options: [],
    }
  }
  
  componentDidMount() {
    let { uiSchema: { focusOnMount = false } } = this.props;
    if (focusOnMount) {
      this.refs.asyncConstraintSelector.getInstance().focus();
    }
  }

  handleSelectionChange = (conf, type) => (events) => {
    let { schema, uiSchema, onChange, formData } = this.props
    if (events.length > 0) {
      let { mapping } = conf
      let labelKey = (uiSchema.asyncConstraintSelector && uiSchema.asyncConstraintSelector.labelKey)
      labelKey = mapLabelKey(labelKey)
      
      let schemaEvents = mapToSchema(events, schema.properties[type], mapping, labelKey)
      formData = formData || { includes: [], excludes: [] }
      
      formData[type] = schemaEvents.map(item => applyLabelKey(item, labelKey))
      console.log('on change 1', formData)
      onChange(formData)
    } else {
      formData[type] = []
      console.log('on change 0', formData)
      onChange(formData)
    }
  }

  handleFilter = (option, props) => {
    const labelKey = mapLabelKey(props.labelKey)
    const includes = (this.props.formData && this.props.formData.includes) || []
    const excludes = (this.props.formData && this.props.formData.excludes) || []
    const allTerms = [...includes, ...excludes]
    return !allTerms.includes(applyLabelKey(option, labelKey))
  };

  handleBlur = evt => {
    // TODO: need to understand why this handleBlur method is needed -- it automatically clear 
    // multi-value selection when the input loses focus
    // let selectedText = evt.target.value && evt.target.value.trim();
    // console.log({selectedText: evt})
    // if (selectedText === "") {
    //   this.props.onChange("");
    // }
  }

  renderConstraintToken = type => (option, props, index) => {
    const labelKey = mapLabelKey(props.labelKey)
    return (
      <Token
        key={index}
        onRemove={props.onRemove}
        >
        <div className={cx('btn', 'btn-raised', {
            'btn-success': type === 'includes',
            'btn-danger': type === 'excludes'
          })}
          onClick={props.onRemove}
        >
          <span className='close-btn glyphicon glyphicon-remove-circle icon-white'></span>
          {applyLabelKey(option, labelKey)}
        </div>
      </Token>
    )
  }
}

export class ConstraintSelectorField extends BaseConstraintSelectorField {
  constructor(props) {
    super(props);
    let { schema, uiSchema: { constraintSelector }, formData } = this.props;

    this.state = {
      selected: isValidFormData(formData)
        ? toSelected(formData, schema, constraintSelector.mapping, constraintSelector.options)
        : [],
    };
  }

  render() {
    let {
      uiSchema: { constraintSelector },
      formData,
      schema,
      idSchema: { $id } = {},
    } = this.props

    let labelKey = mapLabelKey(constraintSelector.labelKey)


    let typeConf = Object.assign({}, DEFAULT_OPTIONS, {
        ref: "constraintSelector",
        labelKey,
        selected: this.state.selected,
        onBlur: this.handleBlur,
        multiple: true,
      },
      constraintSelector
    )

    const includesId = $id+'-constraintSelector-includes'
    const excludesId = $id+'-constraintSelector-excludes'
    const included = formData && formData.includes || []
    const excluded = formData && formData.excludes || []

    return (
      <div id={$id}>
        <DefaultLabel {...this.props} id={$id+'-constraintSelector'} />
        <Row>
          <Col xs={12} sm={6}>
            <Label key={0} label="Includes" id={`${includesId}-label`} small />
            <Typeahead
              {...typeConf} 
              id={`${includesId}-input`} 
              className="constraint-selector constraint-selector-includes" 
              filterBy={this.handleFilter}
              renderToken={this.renderConstraintToken('includes')}
              placeholder={`${schema.title.replace(/_/g, '')} to include...`}
              selected={included}
              onChange={this.handleSelectionChange(constraintSelector, 'includes')}
            />
          </Col>
          <Col xs={12} sm={6}>
            <Label key={0} label="Excludes" id={`${excludesId}-label`} small />
            <Typeahead 
              {...typeConf} 
              id={`${includesId}-input`} 
              className="constraint-selector constraint-selector-excludes"
              filterBy={this.handleFilter}
              renderToken={this.renderConstraintToken('excludes')}
              placeholder={`${schema.title.replace(/_/g, '')} to exclude...`}
              selected={excluded}
              onChange={this.handleSelectionChange(constraintSelector, 'excludes')}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

ConstraintSelectorField.propTypes = {
  schema: PropTypes.object.isRequired,
  uiSchema: PropTypes.shape({
    focusOnMount: PropTypes.bool,
    constraintSelector: PropTypes.shape({
      options: PropTypes.array.isRequired,
      mapping: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.string,
        PropTypes.object,
      ]),
      cleanAfterSelection: PropTypes.bool,
    }).isRequired,
  }).isRequired,
}

export class AsyncConstraintSelectorField extends BaseConstraintSelectorField {


  handleSearch = query => {
    if (!query) {
      return;
    }

    let {
      uiSchema: {
        asyncConstraintSelector: {
          url,
          method,
          data,
          optionsPath,
          search = (url, query, method, data) => {
            switch (method) {
              case 'POST': 
                return fetch(`${url}?query=${query}`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(data)
                }).then(res => res.json())
              case 'GET':
              default:
                  return fetch(`${url}?query=${query}`).then(res => res.json())
            }
            
          },
        },
      },
    } = this.props

    search(url, query, method, data)
      .then(json => (optionsPath ? selectn(optionsPath, json) : json))
      .then(options => this.setState({ options }))
  }

  handleOnFocus = () => {
    let {
      uiSchema: {
        asyncConstraintSelector: {
          url,
          method,
          data,
          optionsPath,
          minLength
        },
      },
    } = this.props

    if(minLength === 0) {
      switch (method) {
        case 'POST': 
          return fetch(`${url}?query=`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          }).then(res => res.json())
          .then(json => (optionsPath ? selectn(optionsPath, json) : json))
          .then(options => this.setState({ options }))
        case 'GET':
        default:
          return fetch(`${url}?query=`).then(res => res.json())
          .then(json => (optionsPath ? selectn(optionsPath, json) : json))
          .then(options => this.setState({ options }))
      }
    }
  }
  
  render() {
    let {
      schema,
      uiSchema: { asyncConstraintSelector },
      formData,
      idSchema: { $id } = {},
    } = this.props

    let labelKey = mapLabelKey(asyncConstraintSelector.labelKey)
    let selected = toSelected(
      formData,
      schema,
      asyncConstraintSelector.mapping,
      labelKey
    )

    let typeConf = Object.assign({}, DEFAULT_ASYNC_OPTIONS, {
        ref: "asyncConstraintSelector",
        placeholder: `${schema.title.replace(/_/g, '')} to include...`,
        labelKey,
        onSearch: this.handleSearch,
        options: this.state.options,
        onFocus: this.handleOnFocus,
        onBlur: this.handleBlur,
        multiple: true,
      },
      asyncConstraintSelector
    )

    if (asyncConstraintSelector.overrideOptions) {
      typeConf.onInputChange = this.props.onChange
    }
    const includesId = $id+'-asyncConstraintSelector-includes'
    const excludesId = $id+'-asyncConstraintSelector-excludes'
    const included = formData && formData.includes || []
    const excluded = formData && formData.excludes || []

    return (
      <div id={$id}>
        <DefaultLabel {...this.props} id={$id+'-asyncConstraintSelector'} />
        <Row>
          <Col xs={12} sm={6}>
            <Label key={0} label="Includes" id={`${includesId}-label`} small />
            <AsyncTypeahead 
              {...typeConf} 
              id={`${includesId}-input`} 
              className="constraint-selector constraint-selector-includes" 
              filterBy={this.handleFilter}
              renderToken={this.renderConstraintToken('includes')}
              placeholder={`${schema.title.replace(/_/g, '')} to include...`}
              selected={included}
              onChange={this.handleSelectionChange(asyncConstraintSelector, 'includes')}
            />
          </Col>
          <Col xs={12} sm={6}>
            <Label key={0} label="Excludes" id={`${excludesId}-label`} small />
            <AsyncTypeahead 
              {...typeConf} 
              id={`${excludesId}-input`} 
              className="constraint-selector constraint-selector-excludes"
              filterBy={this.handleFilter}
              renderToken={this.renderConstraintToken('excludes')}
              placeholder={`${schema.title.replace(/_/g, '')} to exclude...`}
              selected={excluded}
              onChange={this.handleSelectionChange(asyncConstraintSelector, 'excludes')}
            />
          </Col>
        </Row>
      </div>
    )
  }
}

AsyncConstraintSelectorField.propTypes = {
  schema: PropTypes.object.isRequired,
  uiSchema: PropTypes.shape({
    focusOnMount: PropTypes.bool,
    asyncConstraintSelector: PropTypes.shape({
      url: PropTypes.string,
      method: PropTypes.string,
      data: PropTypes.object,
      optionsPath: PropTypes.string,
      mapping: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.string,
        PropTypes.object,
      ]),
      overrideOptions: PropTypes.bool,
      search: PropTypes.func,
    }).isRequired,
  }),
};