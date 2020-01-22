import React, { Component } from 'react'
import { ListGroup, ListGroupItem } from 'react-bootstrap'

export default class EditList extends Component {

  schemaLoading = () => <p>Loading...</p>

  groupList = (groups) => {
    if (!groups) return null
    return (
      <ListGroup>
        {
          groups.map(group => 
            <ListGroupItem key={group.key} active={this.props.group && this.props.group.key === group.key}
              onClick={() => this.props.selectGroup(group)}>{ group.name }</ListGroupItem>
          )
        }
      </ListGroup>
    )
  }

  componentDidUpdate(prevProps) {
    const { schema, group } = this.props
    if (!group && !!schema && schema.groups) {
      this.props.selectGroup(schema.groups[0])
    }
  }


  render = () => {
    const schema = this.props.schema

    return <>
      {/* <h4>Sections</h4> */}
      {
        !!schema ? 
          this.groupList(schema.groups) :
          this.schemaLoading()
      }

    </>
  }
}