import React from 'react'

export default class SchemaSearch extends React.Component {
  constructor(props, context) {
    super(props, context)
    
    this.selectSchema = this.selectSchema.bind(this)
    this.state = {
      option: ''
    }
  }

  componentDidMount() {
    this.props.getSchemaList(this.props.type)
  }

  componentWillUnmount() {
    // this.props.deselectSchema()
  }

  selectSchema(e) {
    if(e.target.value !== '') {
      const type = this.props.schemaList[e.target.value].__type__
      this.props.selectSchema(type, 'new-entry')
      this.props.openModal()
      this.setState({option: ''})
    }
  }

  render() {
    const schemaList = this.props.schemaList || []

    return <div>
      <h3>Select a schema (template)</h3>
      <form>
        <select onChange={this.selectSchema} value={this.state.option}>
          <option value="">{ this.props.schemaListPending ? 'Loading ...' : 'Select One' }</option>
          {
            schemaList.map((el, i) => {
              return (
                <option value={i} key={i}>{el.title}</option>
              )
            })
          }
        </select>
      </form>
    </div>
  }
}
