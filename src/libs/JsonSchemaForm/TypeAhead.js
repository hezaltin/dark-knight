import React, { Component } from "react"
import PropTypes from "prop-types"
import { AsyncTypeahead, Typeahead, Token } from "react-bootstrap-typeahead"
import {
  DEFAULT_OPTIONS,
  DEFAULT_ASYNC_OPTIONS,
  mapLabelKey,
  applyLabelKey,
  mapToSchema,
  toSelected,
} from './TypeAhead-util'
import selectn from "selectn"
import { DefaultLabel } from "./Label"


class BaseTypeaheadField extends Component {
  handleSelectionChange = conf => events => {
    let { schema, uiSchema, onChange } = this.props
    if (events.length > 0) {
      let { mapping, cleanAfterSelection = false } = conf
      let labelKey = (uiSchema.typeahead && uiSchema.typeahead.labelKey) || (uiSchema.asyncTypeahead && uiSchema.asyncTypeahead.labelKey)
      labelKey = mapLabelKey(labelKey)

      let schemaEvents = mapToSchema(events, schema, mapping, labelKey)

      onChange(schemaEvents.map(item => applyLabelKey(item, labelKey)))
      if (cleanAfterSelection) {
        setTimeout(() => {
          if (this.refs.typeahead) {
            this.refs.typeahead.getInstance().clear();
          }
        }, 0);
      }
    } 
  };

  componentDidMount() {
    let { uiSchema: { focusOnMount = false } } = this.props;
    if (focusOnMount) {
      this.refs.typeahead.getInstance().focus();
    }
  }

  handleBlur = evt => {
    // TODO: need to understand why this handleBlur method is needed -- it automatically clear 
    // multi-value selection when the input loses focus
    // let selectedText = evt.target.value && evt.target.value.trim();
    // console.log({selectedText: evt})
    // if (selectedText === "") {
    //   this.props.onChange("");
    // }
  };
}

export class TypeaheadField extends BaseTypeaheadField {
  render() {
    let {
      uiSchema: { typeahead },
      formData,
      schema,
      idSchema: { $id } = {},
    } = this.props;

    let labelKey = mapLabelKey(typeahead.labelKey);
    let selected = toSelected(formData, schema, typeahead.mapping, labelKey, typeahead.options);
    let typeConf = Object.assign({}, DEFAULT_OPTIONS, {
        onChange: this.handleSelectionChange(typeahead),
        labelKey,
        selected,
        onBlur: this.handleBlur,
      },
      typeahead
    );

    return (
      <div id={$id}>
        <DefaultLabel {...this.props} />
        <Typeahead {...typeConf} />
      </div>
    );
  }
}

TypeaheadField.propTypes = {
  schema: PropTypes.object.isRequired,
  uiSchema: PropTypes.shape({
    focusOnMount: PropTypes.bool,
    typeahead: PropTypes.shape({
      options: PropTypes.array.isRequired,
      mapping: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.string,
        PropTypes.object,
      ]),
      cleanAfterSelection: PropTypes.bool,
    }).isRequired,
  }).isRequired,
};

export class AsyncTypeaheadField extends BaseTypeaheadField {
  constructor(props) {
    super(props)

    this.state = {
      options: [],
    };
  }

  handleSearch = query => {
    if (!query) {
      return;
    }

    let {
      uiSchema: {
        asyncTypeahead: {
          url,
          optionsPath,
          search = (url, query) =>
            fetch(`${url}?query=${query}`).then(res => res.json()),
        },
      },
    } = this.props;

    search(url, query)
      .then(json => (optionsPath ? selectn(optionsPath, json) : json))
      .then(options => this.setState({ options }));
  };

  handleOnFocus = () => {
    let {
      uiSchema: {
        asyncTypeahead: {
          url,
          optionsPath,
          minLength
        },
      },
    } = this.props;

    if(minLength === 0) {
      fetch(`${url}`).then(res => res.json())
      .then(json => (optionsPath ? selectn(optionsPath, json) : json))
      .then(options => this.setState({ options }));
    }
  }

  renderConstraintToken(option, props, index) {
    const labelKey = mapLabelKey(props.labelKey)
    return (
      <Token
        key={index}
        onRemove={props.onRemove}>
        <button>X</button>
        {`${applyLabelKey(option, labelKey)} (Pop: 1234)`}
      </Token>
    )
  }

  
  render() {
    let {
      schema,
      uiSchema: { asyncTypeahead },
      formData,
      idSchema: { $id } = {},
      multiple,
      renderConstraintToken
    } = this.props

    let labelKey = mapLabelKey(asyncTypeahead.labelKey)
    let selected = toSelected(
      formData,
      schema,
      asyncTypeahead.mapping,
      labelKey
    )

    let typeConf = Object.assign({}, DEFAULT_ASYNC_OPTIONS, {
        selected,
        labelKey,
        onChange: this.handleSelectionChange(asyncTypeahead),
        onSearch: this.handleSearch,
        options: this.state.options,
        onFocus: this.handleOnFocus,
        onBlur: this.handleBlur,
        multiple: true,
      },
      asyncTypeahead
    );

    if (asyncTypeahead.overrideOptions) {
      typeConf.onInputChange = this.props.onChange
    }

    if (renderConstraintToken) {
      typeConf.renderConstraintToken = renderConstraintToken
    }

    return (
      <div id={$id}>
        <DefaultLabel {...this.props} />
        <AsyncTypeahead id={$id+'-asyncTypeahead'} {...typeConf} clearButton>

        </AsyncTypeahead>
      </div>
    );
  }
}

AsyncTypeaheadField.propTypes = {
  schema: PropTypes.object.isRequired,
  uiSchema: PropTypes.shape({
    focusOnMount: PropTypes.bool,
    asyncTypeahead: PropTypes.shape({
      url: PropTypes.string,
      optionsPath: PropTypes.string,
      mapping: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.string,
        PropTypes.object,
      ]),
      cleanAfterSelection: PropTypes.bool,
      overrideOptions: PropTypes.bool,
      search: PropTypes.func,
    }).isRequired,
  }),
};