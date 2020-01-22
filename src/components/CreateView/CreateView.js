import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'
import SchemaSearch from './SchemaSearch/SchemaSearch'
import CreateEntry from './CreateEntry/CreateEntry'

class CreateView extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.state = {
      showModal: false
    }
  }

  componentWillMount() {
    this.props.deselectSchema()
  }

  openModal() {
    this.setState({
      showModal: true
    })
  }

  closeModal() {
    this.setState({
      showModal: false
    })
  }

  render() {
    const type = this.props.match.params.type

    return <>
      <SchemaSearch openModal={this.openModal} type={type} {...this.props}></SchemaSearch>
      <CreateEntry show={this.state.showModal} closeModal={this.closeModal} {...this.props}></CreateEntry>
    </>
  }
}

CreateView.propTypes = process.env.NODE_ENV !== "production" ? {
  selection: PropTypes.object,
  schemaList: PropTypes.array,
  schemaListPending: PropTypes.bool,
  selectSchema: PropTypes.func,
  deselectSchema: PropTypes.func,
  checkDuplicate: PropTypes.func,
} : {}

export default CreateView
