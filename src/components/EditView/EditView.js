import React from 'react'
import PropTypes from 'prop-types'
import EditEntry from './EditEntry/EditEntry'
import EditList from './EditList/EditList'
import {Row, Col} from 'react-bootstrap'
import { isEmpty } from 'lodash'

// import NewEntry from './NewEntry/NewEntry'
// import EditEntry from './EditEntry/EditEntry'

require('isomorphic-fetch');
class EntryView extends React.Component {
  constructor(props) {
    super(props)
    this.selectGroup = this.selectGroup.bind(this)
    this.state = {
      group: null
    }
  }

  componentDidMount() { 
    if (this.props.type) {
      this.props.selectSchema(this.props.type, 'grouped-edit')
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.type || prevProps.type !== this.props.type) {
      this.props.deselectSchema()
      this.props.selectSchema(this.props.type, 'grouped-edit')
    }
  }

  componentWillUnmout() {
    this.props.deselectSchema()
  }

  selectGroup(group) {
    this.setState({ group })
    this.props.fetchDoc(this.props.uri, 'doc', group.key)
  }

  render() {
    // console.log({schema: this.props.schema})
    return <>
      <Row>
        <Col xs={12}>
          <h4 style={{marginTop: 0}}>[Company Name Placeholder]</h4>
        </Col>
      </Row>
      <Row>
        <Col xs={4} sm={2}>
          <EditList schema={this.props.schema} selectGroup={this.selectGroup} group={this.state.group}></EditList>
        </Col>
        <Col xs={8} sm={8}>
          <EditEntry schema={this.props.schema} uri={this.props.uri} group={this.state.group} doc={this.props.documentView} deselectSchema={this.props.deselectSchema} fetchDoc={this.props.fetchDoc}></EditEntry>
        </Col>
      </Row>
    </>
  }
}

EntryView.propTypes = process.env.NODE_ENV !== "production" ? {
  selectedSchema: PropTypes.string,
  document: PropTypes.object,
  schemaList: PropTypes.array,
  schema: PropTypes.object,
  schemaPending: PropTypes.bool,
  selectSchema: PropTypes.func,
  deselectSchema: PropTypes.func,
  checkDuplicate: PropTypes.func,
  fetchDoc: PropTypes.func,
} : {}

export default EntryView

