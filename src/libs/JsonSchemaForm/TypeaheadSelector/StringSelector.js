import React, { Component } from "react"
import PropTypes from "prop-types"
import cx from 'classnames'
import selectn from "selectn"
import { Row, Col } from 'react-bootstrap'
import { AsyncTypeahead, Typeahead, Token, Highlighter, Menu, MenuItem } from "react-bootstrap-typeahead"
import { groupBy, map } from 'lodash'
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

class BaseStringSelectorField extends Component {
  constructor(props) {
    super(props)

    this.state = {
      options: [],
      query: '',
    }
  }
  
  componentDidMount() {
    let { uiSchema: { focusOnMount = false } } = this.props;
    if (focusOnMount) {
      this.refs.asyncStringSelector.getInstance().focus();
    }
    // console.log({props: this.props})
  }

  handleSelectionChange = (conf) => (events) => {

    let { onChange } = this.props
    const formData = events
    // console.log('change', events)
    onChange(formData)
  }

  // handleFilter = (option, props) => {
  //   const labelKey = mapLabelKey(props.labelKey)
  //   const allTerms = this.props.formData || []
  //   return !allTerms.includes(applyLabelKey(option, labelKey))
  // };

  handleBlur = event => {
    let { schema, uiSchema: { asyncStringSelector: { labelKey } }, onChange, formData, errorSchema } = this.props
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

  // renderMenuItemChildren = (option, props, index) => {
  //   let { uiSchema: { asyncStringSelector: { labelKey, attributes } }, idSchema: { $id } } = this.props
  //   return <Highlighter key={`${$id}-heading`} search={props.text}>
  //     {applyLabelKey(option, mapLabelKey(labelKey))}
  //   </Highlighter>
  // }

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

export class StringSelectorField extends BaseStringSelectorField {
  constructor(props) {
    super(props);
    let { schema, uiSchema: { stringSelector }, formData } = this.props;

    this.state = {
      selected: isValidFormData(formData)
        ? toSelected(formData, schema, stringSelector.mapping, stringSelector.options)
        : [],
    };
  }

  render() {
    let {
      uiSchema: { stringSelector,  stringSelector: {labelKey}},
      formData,
      schema,
      idSchema: { $id } = {},
    } = this.props

    let typeConf = Object.assign({}, DEFAULT_OPTIONS, {
        ref: "stringSelector",
        labelKey,
        selected: this.state.selected,
        onBlur: this.handleBlur,
        multiple: false,
        highlightOnlyResult: true,
      },
      stringSelector
    )

    const stringId = $id+'-stringSelector'
    const strings = []

    return (
      <div id={$id}>
        <DefaultLabel {...this.props} id={$id+'-stringSelector'} />
        <Typeahead
          {...typeConf} 
          id={`${stringId}-input`} 
          className="string-selector" 
          // filterBy={this.handleFilter}
          placeholder={`Search and select one or multiple of ${schema.title.replace(/_/g, '')} from the dropdown list.`}
          selected={strings}
          onChange={this.handleSelectionChange(stringSelector)}
          ref={(ref) => this.selector = ref}
          renderMenuItemChildren = {this.renderMenuItemChildren}
        />
      </div>
    );
  }
}

StringSelectorField.propTypes = {
  schema: PropTypes.object.isRequired,
  uiSchema: PropTypes.shape({
    focusOnMount: PropTypes.bool,
    stringSelector: PropTypes.shape({
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

export class AsyncStringSelectorField extends BaseStringSelectorField {


  handleSearch = query => {
    if (!query) {
      return;
    }

    let {
      uiSchema: {
        asyncStringSelector: {
          url,
          method,
          data,
          optionsPath,
        },
      },
    } = this.props

    const search = (url, query, method, data) => {
      this.setState({query: query})
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
        if (query === this.state.query)
          return this.setState({ options })
      })
  }

  handleOnFocus = () => {
    let {
      uiSchema: {
        asyncStringSelector: {
          url,
          method,
          data,
          optionsPath,
          minLength
        },
      },
    } = this.props

    if(minLength === 0) {
      this.setState({query: ''})
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
          return fetch(`${url}query=`).then(res => res.json())
          .then(json => (optionsPath ? selectn(optionsPath, json) : json))
          .then(options => {
            if (this.state.query === '')
            return this.setState({ options })
          })
      }
    }
  }
  
  render() {
    let {
      schema,
      uiSchema: { asyncStringSelector },
      formData,
      idSchema: { $id } = {},
      errorSchema
    } = this.props

    let labelKey = mapLabelKey(asyncStringSelector.labelKey)
    // let selected = toSelected(
    //   formData,
    //   schema,
    //   asyncSingleObjectSelector.mapping,
    //   labelKey,
    // )

    let typeConf = Object.assign({}, DEFAULT_ASYNC_OPTIONS, 
      {
        ref: "asyncStringSelector",
        placeholder: `${schema.title.replace(/_/g, '')} to include...`,
        labelKey,
        onSearch: this.handleSearch,
        options: this.state.options,
        onFocus: this.handleOnFocus,
        onBlur: this.handleBlur,
        // onInputChange: this.handleInputChange,
        multiple: true,
        delay: 100,
      },
      asyncStringSelector,
    )
    const filterByCallback = (option, props) => (
      true
    );
    typeConf.filterBy = filterByCallback

    if (asyncStringSelector.overrideOptions) {
      typeConf.onInputChange = this.props.onChange
    }
    const stringId = $id+'-asyncStringSelector'
    const strings = formData || []

    return (
      <div id={$id}>
        <DefaultLabel {...this.props} id={$id+'-stringSelector'} />
        <AsyncTypeahead 
          {...typeConf} 
          id={`${stringId}-input`} 
          className="string-selector" 
          placeholder={`Search and select one or multiple of ${schema.title.replace(/_/g, '')} from the dropdown list.`}
          // selected={strings}
          onChange={this.handleSelectionChange(asyncStringSelector)}
          ref={(ref) => this.selector = ref}
          renderMenu = {this.renderMenu}
          renderToken = {this.renderToken}
        />
      </div>
    )
  }
}

AsyncStringSelectorField.propTypes = {
  schema: PropTypes.object.isRequired,
  uiSchema: PropTypes.shape({
    focusOnMount: PropTypes.bool,
    asyncStringSelector: PropTypes.shape({
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