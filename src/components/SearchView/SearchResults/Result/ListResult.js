import React from 'react'
import { Col, Table, Dropdown, DropdownButton, MenuItem, Glyphicon } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import selectn from 'selectn'
import { isEmpty } from 'lodash'
import SearchSnippet from './SearchSnippet.js'
import './shared.css'
import './ListResult.css'

const imageTagStyleProps = {
  height:'100%',
  width:'30%',
  objectFit: 'cover',
}

const imageContent = {
  fontSize:'130%',
  fontWeight: '700',
  height: '100%',
  width: '30%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#ececec',
  color: '#888',
  userSelect: 'none',
}

const tableHead ={
  width:'20%'
}

function getFilename(id) {
  if (!id) {
    return null;
  }
  return id.split('%2F').pop();
};

// https://stackoverflow.com/a/41073463/3546482
function evalTemplate(s, params) {
  return Function(...Object.keys(params), "return " + s)
    (...Object.values(params));
}

class ListResult extends React.Component {
  constructor(props) {
    super(props)
    this._getSchemaAttribute = this._getSchemaAttribute.bind(this)
    this._getSearchDataAttribute = this._getSearchDataAttribute.bind(this)
    this.displayAttribute = this.displayAttribute.bind(this)
    this.state = {
      bookmarked: false
    }
  }

  componentDidMount() {
    // This is workaround to kick off search once a user log in
    // However it does run every time user navigates back to search route (e.g. from detail),
    // although no duplicate http search request is being made.
    
    this.setState({
      bookmarked: this.props.result.matches.bookmarked
    })
  }

  // displayMetadata(content, dataSchema, uiSchema) {
  //   const schema = dataSchema.properties.envelope.properties.instance.properties.content.properties
  //   const link = evalTemplate(uiSchema.link.template, uiSchema.link.params.reduce((t, x) => ({...t, [x]: content[x]}), {}))
  //   return <>
  //     <Table className="result-metadata" size="sm" bordered={false} hover={false} striped={false}>
  //       <tbody>
  //         {
  //           uiSchema.attributes.map((attr, i) => {
  //             return <tr key={i}>
  //               <th width='160px'>{ schema[attr].title }</th>
  //               <td>{ content[attr] }</td>
  //             </tr>
  //           })
  //         }
  //         <tr width='160px'>
  //           <th>{uiSchema.link.name}:</th>
  //           <td><a href={link} target="__blank">{link}</a></td>
  //         </tr>
  //       </tbody>
  //     </Table>
  //   </>  
  // }

  _getSchemaAttribute(schema, attr) {
    let attribute = schema.properties
    attribute = selectn(attr.path, attribute)
    return attribute
  }

  _getSearchDataAttribute(data, attr) {
    let attribute = data
    attribute = selectn(attr.path, attribute)
    return attribute
  }



  displayAttribute(attrData, attrSchema) {
    if (!attrData) {
      return ''
    }
    switch(attrSchema.type) {
      case 'array': {
        switch(attrSchema.items.type) {
          case 'object': {
            if (attrSchema.items.properties.group && attrSchema.items.properties.item) {
              return attrData.map(x => `${x.group} - ${x.item}`).join('; ')
            } else {
              return attrData.map(x => x.name || x.label).join('; ')
            }
          }
          default:
            return attrData ? attrData.join('; ') : ''
        }
      }

      case 'object': {
        if (attrSchema.properties.score && attrSchema.properties.description) {
          if (isEmpty(attrData)) {
            return null
          }
          return `${attrData.score} - ${attrData.description}`
        } 
      }

      default:
        return attrData
    }
  }

  render() {

    const props = this.props
    if(!props.result.matches || !props.searchResultSchema || !props.displayMode){
      // console.log('condi failed', props.result.matches, props.searchResultSchema, props.displayMode)
      return null
    }
    
    const {dataSchema, uiSchema} = props.searchResultSchema

    const mode = props.displayMode

    const result = this.props.result
    const data = result.matches
    // console.log({s: dataSchema.properties['@type'].const, d: data['@type']})
    if (dataSchema.properties['__type__'].const !== data['__type__']) {
      // console.log("render null", dataSchema.properties['@type'], data)
      return null
    }
    // console.log({dataSchema, uiSchema, data})
    const bookmarked = this.state.bookmarked
  
    // const schema = dataSchema.properties
    const link = dataSchema['brain:link'] && 
      evalTemplate(dataSchema['brain:link']['brain:linkTemplate'], dataSchema['brain:link']['brain:linkParams'].reduce((t, x) => ({...t, [x]: data[x]}), {}))
    
    
    return <Col xs={12} style = {{border:'1px solid #bbb4b4',marginBottom:'10px'}} className='ml-search-result-xs'>
      <div className="btn-group" style={{float: 'right', margin: "6px 0 0 16px"}}>
    <Dropdown className="result-menu" pullRight id="dropdown-custom-1">
      <Dropdown.Toggle noCaret className="toggle" bsSize="xsmall">
        <Glyphicon glyph="option-horizontal" style={{color: "#bbb", fontSize: "16px"}} />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <MenuItem eventKey="1" disabled={bookmarked} 
          onSelect={() => { 
            this.props.addBookmark(this.props.result.id)
            this.setState({ bookmarked: true })
          }}>Bookmark</MenuItem>
        <MenuItem eventKey="2" disabled={!bookmarked}
          onSelect={() => { 
            this.props.removeBookmark(result.id) 
            this.setState({ bookmarked: false })
          }}>Unbookmark</MenuItem>
        {
          <MenuItem eventKey="3" disabled={data.__type__ !== '/nbd/companies'}
          href={`/edit?type=/nbd/companies&uri=${data.uri}`}>Edit</MenuItem>
        }
        {/* <MenuItem divider />
        <MenuItem eventKey="3"
          onSelect={() => { props.searchForSimilar({
            authors: props.result.matches.authors,
            businesses: props.result.matches.organizations,
            keywords: props.result.matches.keywords,
            docId: props.result.matches.docId,
          }) }}>Find more like this</MenuItem> */}
      </Dropdown.Menu>
    </Dropdown>
      </div>
      <h4 style={{ margin: '3px 6px 9px 0', fontWeight: '900', fontSize: '20px',  }}>
        {
          bookmarked ? <Glyphicon glyph="star" style={{fontSize: "16px", marginRight: '4px', color: '#ffdf00'}} /> : null
        }
        <span style={{color: '#d9230f', fontWeight: 600}}>
          {/* <Link style={{ textDecoration: 'none' }} to={{
            pathname: this.props.detailPath,
            state: {type: this.props.type, uri: this.props.result.uri},
            search: `?type=${this.props.type}&uri=${this.props.result.uri}`
          }}>{ data[uiSchema[mode].heading] }</Link> */}
          { this.displayAttribute(data[uiSchema[mode].heading], dataSchema.properties[uiSchema[mode].heading]) }
        </span>
      </h4>
      <div className="ml-search-result-metadata">
        <Table className="result-metadata" size="sm" bordered={false} hover={false} striped={false}>
          <tbody>
            {
              uiSchema[mode].attributes.map((attr, i) => {
                const attrData = data[attr]
                const attrSchema = dataSchema.properties[attr]
                return <tr key={i}>
                  <th width='160px'>{ attrSchema.title }</th>
                  <td>{this.displayAttribute(attrData, attrSchema)}</td>
                </tr>
              })
            }
            { 
              link && <tr width='160px'>
                <th>{dataSchema['brain:link']['brain:linkName']}:</th>
                <td><a href={link} target="__blank">{link}</a></td>
              </tr>
            }
          </tbody>
        </Table>
      </div>
      {/* { this.props.displayAbstract && data.description && <p>{ content.description }</p> } */}
    </Col>
  }

}

export default ListResult;