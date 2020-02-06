import React, { Component } from "react"
import PropTypes from "prop-types"
import RichTextEditor from "react-rte"
import { DefaultLabel } from "../Label"

// const DEFAULT_FORMAT = "html"

export class RichTextEditorField extends Component {
  constructor(props) {
    super(props)

    let {
      formData = "",
    } = props

    this.state = {
      value: RichTextEditor.createValueFromString(formData.html, 'html'),
    }
  }

  updateFormData = () => {
    let {
      onChange,
      formData: { html }
    } = this.props
    let { value } = this.state
    if (onChange) {
      const valueHtml = value.toString('html')
      if (valueHtml !== html) {
        onChange({html: valueHtml.replace(/&nbsp;/g, ' ')})
      }
    }
  }

  handleChange = value => {
    let { uiSchema: { updateOnBlur = false } } = this.props
    this.setState({ value }, () => !updateOnBlur && this.updateFormData())
  }

  handleBlur = () => {
    let { uiSchema: { updateOnBlur = false } } = this.props
    if (updateOnBlur) {
      this.updateFormData()
    }
  }

  render() {
    let { uiSchema: { richTextEditor }, idSchema: { $id } = {} } = this.props
    let autoFocus = this.props.uiSchema["ui:autofocus"]

    return (
      <div id={$id}>
        <DefaultLabel {...this.props} />
        <RichTextEditor
          onBlur={this.handleBlur}
          {...richTextEditor}
          autoFocus={autoFocus}
          value={this.state.value}
          onChange={this.handleChange}
          className="rich-text-editor"
        />
      </div>
    )
  }
}

RichTextEditorField.propTypes = {
  uiSchema: PropTypes.shape({
    updateOnBlur: PropTypes.bool,
    richTextEditor: PropTypes.shape({
      format: PropTypes.string,
    }),
  }),
}