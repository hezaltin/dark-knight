import React, { Component } from "react"
import PropTypes from "prop-types"
import cx from 'classnames'
import selectn from "selectn"
import { Row, Col } from 'react-bootstrap'
import { AsyncTypeahead, Typeahead, Token, Highlighter } from "react-bootstrap-typeahead"
import { isEmpty, isEqual } from 'lodash'
import {
  DEFAULT_OPTIONS,
  DEFAULT_ASYNC_OPTIONS,
  mapLabelKey,
  applyLabelKey,
  mapToSchema,
  toSelected,
  isValidFormData,
} from '../TypeAhead-util'
import { DefaultLabel, Label } from "../Label"
import './Selector.css'

class BaseSingleObjectSelectorField extends Component {
  constructor(props) {
    super(props)

    this.state = {
      options: [],
      query: '',
      isLoading: false,
      defaultInputValue: {},
      formData: props.formData
    }

  }
  
  componentDidMount() {
    let { uiSchema: { focusOnMount = false } } = this.props;
    if (focusOnMount) {
      this.refs.asyncSinlgeObjectSelector.getInstance().focus();
    }
  }

  componentDidUpdate(prevProps) {
    if ((isEmpty(prevProps.formData) && !isEmpty(this.props.formData)) || !isEqual(prevProps.formData, this.props.formData)) {
      this.setState({formData: this.props.formData})
    }
    // if ((!prevProps.formData || isEmpty(prevProps.formData)) && this.props.formData) {
    //   this.setState({
    //     defaultInputValue: this.props.formData
    //   })
    // }
  }

  handleSelectionChange = (conf) => (events) => {
    this.setState({options: []})
    let { schema: { type }, uiSchema, onChange, formData } = this.props
    if (type === 'array') {
      onChange(events || [])
    } else {
      onChange(events && events[0])
    }
  }

  // handleFilter = (option, props) => {
  //   const labelKey = mapLabelKey(props.labelKey)
  //   const allTerms = this.props.formData || []
  //   return !allTerms.includes(applyLabelKey(option, labelKey))
  // };

  handleBlur = event => {
    let { schema, uiSchema: { singleObjectSelector: { labelKey } }, onChange, formData, errorSchema } = this.props
    labelKey = mapLabelKey(labelKey)

    const label = formData && applyLabelKey(formData, labelKey)
    let selectedText = event.target.value && event.target.value.trim()
    
    if (selectedText !== label) {
      onChange()
      // this.selector.getInstance().clear()
    }
  }

  handleBlurAsync = event => {
    let { schema, uiSchema: { asyncSingleObjectSelector: { labelKey } }, onChange, formData, errorSchema } = this.props
    labelKey = mapLabelKey(labelKey)

    const label = formData && applyLabelKey(formData, labelKey)
    let selectedText = event.target.value && event.target.value.trim()
    
    if (selectedText !== label) {
      onChange()
      // this.selector.getInstance().clear()
    }
  }


  // renderObjectToken = () => (option, props, index) => {
  //   const labelKey = mapLabelKey(props.labelKey)
  //   return (
  //     // TODO: add ability to inject custom token component
  //     <Token
  //       key={index}
  //       onRemove={props.onRemove}
  //       >
  //       <div className={cx('btn', 'btn-raised')}
  //         onClick={props.onRemove}
  //       >
  //         <span className='close-btn glyphicon glyphicon-remove-circle icon-white'></span>
  //         {applyLabelKey(option, labelKey)}
  //       </div>
  //     </Token>
  //   )
  // }

  renderMenuItemChildren = (option, props, index) => {
    let { uiSchema: { singleObjectSelector: { labelKey, attributes } }, idSchema: { $id } } = this.props
    return [
      <Highlighter key={`${$id}-heading`} search={props.text}>
        {applyLabelKey(option, mapLabelKey(labelKey))}
      </Highlighter>,
      !!attributes && 
      <Row key={`${$id}-attributes`} style={{fontSize: '11px', paddingBottom: '4px'}}>
        {
          attributes.map((x, i) => {
            let label =  applyLabelKey(option, mapLabelKey(x.labelKey))
            label = label === undefined ? '' : label
            const text = (x.title ? x.title+': ' : '') + (label || '')
            return <Col xs={12} sm={x.col} key={`${$id}-attribute-${i}`} style={{overflow: 'hidden'}}>
              { x.highlight ? <Highlighter search={props.text}>{text}</Highlighter> : text }
            </Col>
          })
        }
      </Row>
    ]
  }

  renderAsyncMenuItemChildren = (option, props, index) => {
    let { uiSchema: { asyncSingleObjectSelector: { labelKey, attributes } }, idSchema: { $id } } = this.props
    return [
      <Highlighter key={`${$id}-heading`} search={props.text}>
        {applyLabelKey(option, mapLabelKey(labelKey))}
      </Highlighter>,
      <Row key={`${$id}-attributes`} style={{fontSize: '11px', paddingBottom: '4px'}}>
        {
          attributes.map((x, i) => {
            let label =  applyLabelKey(option, mapLabelKey(x.labelKey))
            label = label === undefined ? '' : label
            const text = (x.title ? x.title+': ' : '') + (label || '')
            return <Col xs={12} sm={x.col} key={`${$id}-attribute-${i}`} style={{overflow: 'hidden'}}>
              { x.highlight ? <Highlighter search={props.text}>{text}</Highlighter> : text }
            </Col>
          })
        }
      </Row>
    ]
  }
}

export class SingleObjectSelectorField extends BaseSingleObjectSelectorField {
  constructor(props) {
    super(props)
    let { schema, uiSchema: { singleObjectSelector }, formData } = this.props

    // this.state = {
    //   selected: isValidFormData(formData)
    //     ? toSelected(formData, schema, singleObjectSelector.mapping, singleObjectSelector.options)
    //     : [],
    // };
  }

  render() {
    let {
      uiSchema: { singleObjectSelector },
      schema,
      idSchema: { $id } = {},
    } = this.props
    let formData = this.state.formData
    // console.log({field: schema.title, formData: JSON.stringify(formData), propsData: JSON.stringify(this.props.formData)})
    
    let labelKey = mapLabelKey(singleObjectSelector.labelKey)

    let typeConf = Object.assign({}, DEFAULT_OPTIONS, singleObjectSelector, {
        ref: "singleObjectSelector",
        labelKey,
        // selected: this.state.selected,
        onBlur: this.handleBlur,
        multiple: false,
        highlightOnlyResult: true,
      }
    )

    if (formData && !isEmpty(formData) && (
      Object.values(formData).every(val => !isEmpty(val) || 
      (formData.uri && formData.label)
    ))) {
      
      typeConf.selected = [formData]
    }

    const filterByCallback = (option, props) => (
      true
    );
    typeConf.filterBy = filterByCallback

    const objectId = $id+'-singleObjectSelector'
    // const object = (formData && [formData]) || []

    return (
      <div id={$id}>
        <DefaultLabel {...this.props} id={$id+'-singleOjectSelector'} />
        <Typeahead
          {...typeConf} 
          id={`${objectId}-input`} 
          className="single-object-selector" 
          // filterBy={this.handleFilter}
          placeholder={`Search and select a ${schema.title.replace(/_/g, '')} from the dropdown list.`}
          onChange={this.handleSelectionChange(singleObjectSelector)}
          ref={(ref) => this.selector = ref}
          renderMenuItemChildren = {this.renderMenuItemChildren}
        />
      </div>
    );
  }
}

SingleObjectSelectorField.propTypes = {
  schema: PropTypes.object.isRequired,
  uiSchema: PropTypes.shape({
    focusOnMount: PropTypes.bool,
    singleObjectSelector: PropTypes.shape({
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

export class AsyncSingleObjectSelectorField extends BaseSingleObjectSelectorField {

  constructor(props) {
    super(props);
    let { schema, uiSchema: { asyncObjectSelector }, formData } = this.props;

    // this.state = {
    //   selected: isValidFormData(formData)
    //     ? toSelected(formData, schema, asyncObjectSelector.mapping, asyncObjectSelector.options)
    //     : [],
    // }
  }


  
  handleSearch = query => {
    if (!query) {
      return;
    }

    let {
      uiSchema: {
        asyncSingleObjectSelector: {
          url,
          method,
          data,
          optionsPath,
        },
      },
    } = this.props

    const search = (url, query, method, data) => {
      this.setState({query: query, isLoading: true, options: []})
      switch (method) {
        case 'POST': 
          return fetch(`${url}query=${encodeURIComponent(query)}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          }).then(res => res.json())
        case 'GET':
        default:
          return fetch(`${url}query=${encodeURIComponent(query)}`).then(res => res.json())
      }
      
    }
    

    search(url, query, method, data)
      .then(json => (optionsPath ? selectn(optionsPath, json) : json))
      .then(options => {
        if (query === this.state.query) {
          // console.log({query, options})
          this.setState({isLoading: false, options: options})
        }
      })
  }

  handleOnFocus = () => {
    let {
      uiSchema: {
        asyncSingleObjectSelector: {
          url,
          method,
          data,
          optionsPath,
          minLength
        },
      },
    } = this.props

    if(minLength === 0) {
      this.setState({query: '', isLoading: true, options: []})
      switch (method) {
        case 'POST': 
          return fetch(`${url}query=`, {
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
          return fetch(`${url}query=`).then(res => res.json())
          .then(json => (optionsPath ? selectn(optionsPath, json) : json))
          .then(options => {
            if (this.state.query === ''){
              return this.setState({isLoading: false, options})
            }
          })
      }
    }
  }
  
  render() {
    let {
      schema,
      uiSchema: { asyncSingleObjectSelector },
      idSchema: { $id } = {},
      errorSchema
    } = this.props
    let labelKey = mapLabelKey(asyncSingleObjectSelector.labelKey)
    let formData = this.state.formData

    // console.log({field: schema.title, formData: JSON.stringify(formData), propsData: JSON.stringify(this.props.formData)})
    // TODO: champion is a multi-value field but singleObjectSelector ui schema is applied
    // if (isEmpty(formData) || !formData) {
    //   console.log('data is missing', schema.title, formData)
    // } else {
    //   console.log('data is here', schema.title, formData, applyLabelKey(formData, labelKey))
    // }

    // let selected = toSelected(
    //   formData,
    //   schema,
    //   asyncSingleObjectSelector.mapping,
    //   labelKey,
    // )

    let typeConf = Object.assign({}, DEFAULT_ASYNC_OPTIONS, 
      asyncSingleObjectSelector,
      {
        ref: "asyncSingleObjectSelector",
        placeholder: `${schema.title.replace(/_/g, '')} to include...`,
        labelKey,
        onSearch: this.handleSearch,
        options: this.state.options,
        onFocus: this.handleOnFocus,
        onBlur: this.handleBlurAsync,
        // onInputChange: this.handleInputChange,
        // multiple: true,
        highlightOnlyResult: true,
        delay: 100,
        // selected: this.state.selected,
        // isLoading: this.state.isLoading,
      },
    )
    if (formData && !isEmpty(formData) && (
      Object.values(formData).every(val => !isEmpty(val) || 
      (formData.uri && formData.label)
    ))) {
      
      typeConf.selected = [formData]
    }

    const filterByCallback = (option, props) => (
      true
    );
    typeConf.filterBy = filterByCallback

    if (asyncSingleObjectSelector.overrideOptions) {
      typeConf.onInputChange = this.props.onChange
    }
    const objectId = $id+'-asyncSingleObjectSelector'

    return (
      <div id={$id}>
        <DefaultLabel {...this.props} id={$id+'-asyncSingleObjectSelector'} />
        <AsyncTypeahead 
          {...typeConf} 
          id={`${objectId}-input`} 
          className="single-object-selector" 
          placeholder={`Search and select a ${schema.title.replace(/_/g, '')} from the dropdown list.`}
          onChange={this.handleSelectionChange(asyncSingleObjectSelector)}
          ref={(ref) => this.selector = ref}
          renderMenuItemChildren = {this.renderAsyncMenuItemChildren}
        />
      </div>
    )
  }
}

AsyncSingleObjectSelectorField.propTypes = {
  schema: PropTypes.object.isRequired,
  uiSchema: PropTypes.shape({
    focusOnMount: PropTypes.bool,
    asyncSingleObjectSelector: PropTypes.shape({
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