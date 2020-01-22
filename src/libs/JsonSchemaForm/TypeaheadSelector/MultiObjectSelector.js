import React, { Component } from "react"
import PropTypes from "prop-types"
import cx from 'classnames'
import selectn from "selectn"
import { isEmpty, isEqual, groupBy, map } from 'lodash'
import { Row, Col } from 'react-bootstrap'
import { AsyncTypeahead, Typeahead, Token, Highlighter, Menu, MenuItem } from "react-bootstrap-typeahead"
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

class BaseMultiObjectSelectorField extends Component {
  constructor(props) {
    super(props)

    this.state = {
      options: [],
      formData: props.formData,
    }
  }
  
  componentDidMount() {
    let { uiSchema: { focusOnMount = false } } = this.props;
    if (focusOnMount) {
      this.refs.asyncMultiObjectSelector.getInstance().focus();
    }
    // console.log({props: this.props})
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

  // handleSelectionChange = (conf) => (events) => {
  //   let { schema, uiSchema, onChange, formData } = this.props
  //   if (events.length > 0) {
  //     let { mapping } = conf
  //     let labelKey = (uiSchema.asyncMultiObjectSelector && uiSchema.asyncMultiObjectSelector.labelKey)
  //     labelKey = mapLabelKey(labelKey)
      
  //     let schemaEvents = mapToSchema(events, schema.properties, mapping, labelKey)
  //     formData = formData || []
      
  //     formData = schemaEvents.map(item => applyLabelKey(item, labelKey))
  //     onChange(formData)
  //   } else {
  //     formData = []
  //     onChange(formData)
  //   }
  // }

  handleSelectionChange = (conf) => (events) => {
    this.setState({options: []})
    let { schema: { type }, uiSchema, onChange, formData } = this.props
    if (type === 'array') {
      onChange(events || [])
    } else {
      onChange(events && events[0])
    }
  }

  handleFilter = (option, props) => {
    const labelKey = mapLabelKey(props.labelKey)
    const allTerms = this.props.formData || []
    return !allTerms.includes(applyLabelKey(option, labelKey))
  }

  handleBlur = evt => {
    // TODO: need to understand why this handleBlur method is needed -- it automatically clear 
    // multi-value selection when the input loses focus
    // let selectedText = evt.target.value && evt.target.value.trim();
    // console.log({selectedText: evt})
    // if (selectedText === "") {
    //   this.props.onChange("");
    // }
  }

  handleBlurAsync = event => {
    let { schema, uiSchema: { asyncMultiObjectSelector: { labelKey } }, onChange, formData, errorSchema } = this.props
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

  renderMenu = (results, menuProps) => {
    let idx = 0;
    const grouped = groupBy(results, (r) => r.group);
    const items = Object.keys(grouped).sort().map((group) => [
      !!idx && <Menu.Divider key={`${group}-divider`} />,
      <Menu.Header key={`${group}-header`} style={{color: '#d9230f'}}>
        {group === 'undefined' ? ( menuProps.newSelectionPrefix || 'Add a new item:') : group}
      </Menu.Header>,
      map(grouped[group], (item) => {
        const menuItem =
          <MenuItem key={idx} option={item} position={idx}>
            {/* <span>{ group === 'undefined' ? 'New Item' : group }</span> */}
            <Highlighter search={menuProps.text}>
              {item[menuProps.labelKey]}
            </Highlighter>
          </MenuItem>;

        idx++; /* eslint-disable-line no-plusplus */
        return menuItem;
      }),
    ]);

    return <Menu {...menuProps}>{items}</Menu>;
  }

  renderAsyncMenuItemChildren = (option, props, index) => {
    let { uiSchema: { asyncMultiObjectSelector: { labelKey, attributes } }, idSchema: { $id } } = this.props

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

  renderToken = (option, props, index) => {
    return (
      <Token
        key={index}
        onRemove={props.onRemove}>
        <small style={{fontSize: '88%'}}>{option.group || 'New'} -</small> {option.item}
      </Token>
    );
  }
}

export class MultiObjectSelectorField extends BaseMultiObjectSelectorField {
  constructor(props) {
    super(props);
    let { schema, uiSchema: { objectSelector }, formData } = this.props;

    this.state = {
      selected: isValidFormData(formData)
        ? toSelected(formData, schema, objectSelector.mapping, objectSelector.options)
        : [],
    };
  }

  render() {
    let {
      uiSchema: { objectSelector },
      formData,
      schema,
      idSchema: { $id } = {},
    } = this.props

    let labelKey = mapLabelKey(objectSelector.labelKey)
    // if (isEmpty(formData) || !formData) {
    //   return null
    // }

    let typeConf = Object.assign({}, DEFAULT_OPTIONS, {
        ref: "objectSelector",
        labelKey,
        onBlur: this.handleBlur,
        multiple: true,
      },
      objectSelector
    )

    // if (formData && !isEmpty(formData) && Object.values(formData).every(val => !isEmpty(val))) {
    //   console.log({formData})
    //   typeConf.selected = [formData]
    // }

    const objectId = $id+'-objectSelector'
    const objects = formData && formData.objects || []

    return (
      <div id={$id}>
        <DefaultLabel {...this.props} id={$id+'-objectSelector'} />
        <Typeahead
          {...typeConf} 
          id={`${objectId}-input`} 
          className="object-selector" 
          filterBy={this.handleFilter}
          // renderToken={this.renderObjectToken()}
          placeholder={`${schema.title.replace(/_/g, '')} to include...`}
          // selected={objects}
          onChange={this.handleSelectionChange(objectSelector)}
        />
      </div>
    );
  }
}

MultiObjectSelectorField.propTypes = {
  schema: PropTypes.object.isRequired,
  uiSchema: PropTypes.shape({
    focusOnMount: PropTypes.bool,
    objectSelector: PropTypes.shape({
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

export class AsyncMultiObjectSelectorField extends BaseMultiObjectSelectorField {


  handleSearch = query => {
    if (!query) {
      return;
    }

    let {
      uiSchema: {
        asyncMultiObjectSelector: {
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
          this.setState({isLoading: false, options: options})
        }
      })
  }

  handleOnFocus = () => {
    let {
      uiSchema: {
        asyncMultiObjectSelector: {
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
      uiSchema: { asyncMultiObjectSelector },
      idSchema: { $id } = {},
    } = this.props
    let labelKey = mapLabelKey(asyncMultiObjectSelector.labelKey)
    let formData = this.state.formData

    let typeConf = Object.assign({}, DEFAULT_ASYNC_OPTIONS, 
      asyncMultiObjectSelector,
      {
        ref: "asyncMultiObjectSelector",
        placeholder: `${schema.title.replace(/_/g, '')} to include...`,
        labelKey,
        onSearch: this.handleSearch,
        options: this.state.options,
        onFocus: this.handleOnFocus,
        onBlur: this.handleBlurAsync,
        delay: 100,
        multiple: true,
        highlightOnlyResult: false,
      }
    )
    if (!typeConf.allowNew) {
      console.log('new', typeConf.allowNew)
      typeConf.highlightOnlyResult = true
    }

    if (formData && !isEmpty(formData)) {
      // let selected = toSelected(
      //   formData,
      //   schema,
      //   asyncMultiObjectSelector.mapping,
      //   labelKey
      // )
      typeConf.selected = formData
    }

    const filterByCallback = (option, props) => {
      // console.log({option, props})
      return true
    }
    typeConf.filterBy = filterByCallback

    if (asyncMultiObjectSelector.overrideOptions) {
      typeConf.onInputChange = this.props.onChange
    }
    const objectId = $id+'-objectSelector'
    // const objects = formData || []
    if (schema.title === 'Champion(s)') {
      typeConf.renderMenuItemChildren = this.renderAsyncMenuItemChildren
    }
    if (schema.title === 'Technologies') {
      typeConf.renderMenu = this.renderMenu
      typeConf.renderToken = this.renderToken
    }

    return (
      <div id={$id}>
        <DefaultLabel {...this.props} id={$id+'-asyncMultiObjectSelector'} />
        <AsyncTypeahead 
          {...typeConf} 
          id={`${objectId}-input`} 
          className="multi-object-selector" 

          // renderToken={this.renderObjectToken('includes')}
          placeholder={`Search and select one or multiple ${schema.title.replace(/_/g, '')} from the dropdown list.`}
          // defaultInputValue={formData.map(x => applyLabelKey(x, labelKey))}
          onChange={this.handleSelectionChange(asyncMultiObjectSelector)}
          ref={(ref) => this.selector = ref}
        />
      </div>
    )
  }
}

AsyncMultiObjectSelectorField.propTypes = {
  schema: PropTypes.object.isRequired,
  uiSchema: PropTypes.shape({
    focusOnMount: PropTypes.bool,
    asyncMultiObjectSelector: PropTypes.shape({
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