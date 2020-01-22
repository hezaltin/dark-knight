import React from 'react'
import { Col, Table, Dropdown, DropdownButton, MenuItem, Glyphicon } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import SearchSnippet from './SearchSnippet.js'
import './shared.css'
import './CardResult.css'
import { withRouter } from "react-router-dom"

const getFilename = function getFilename(uri) {
  if (!uri) {
    return null;
  }
  return uri.split('/').pop();
}

var imageTagStyleProps = {
  height:'100%',
  width:'100%',
  objectFit: 'cover',
}

const imageContent = {
  fontSize:'130%',
  fontWeight: '700',
  height: '100%',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#ececec',
  color: '#888',
  userSelect: 'none',
}

var displayMetadata = function displayMetadata(instance) {
  return  <Table className="result-metadata" size="sm" bordered={false} hover={false} striped={false}>
    <tbody>
      <tr>
        <th>Category:</th>
        <td>RO membrane</td>
      </tr>
      <tr>
        <th>Serial Number:</th>
        <td>{ instance.productInfo.serialNumber }</td>
      </tr>
      {/* <tr>
        <th>Ra Number:</th>
        <td>{ instance.ra_number || "Not available" }</td>
      </tr> */}
      {/* <tr>
        <th>Manufacturer:</th>
        <td>{ instance.manufacturer }</td>
      </tr> */}
      <tr>
        <th>Launch Date:</th>
        <td>{ instance.productInfo.launchDate }</td>
      </tr>
      {/* <tr>
        <th>Business Unit:</th>
        <td>{ instance.model}</td>
      </tr> */}
    </tbody>
  </Table>
}

var CardResult = function CardResult(props) {
  // console.log(props)
  var handleSelect = (uri) => {
    console.log(uri)
    props.history.push({
      pathname: '/entry/product',
      search: 'uri='+uri.split('/').pop()
    })
  }
  return null

  // console.log('props==>',props)
  if(!props.result.matches){
    return null;
  }
  return <Col xs={3} 
    style={{border: '1px solid #bbb4b4',marginLeft:'16px',marginBottom:'10px', width: '265px'}}
    className='ml-search-result-xs'>
    <div className="btn-group" style={{float: 'right', margin: "6px 0 0 16px"}}>
      <Dropdown className="result-menu" pullRight id="dropdown-custom-1">
        <Dropdown.Toggle noCaret className="toggle" bsSize="xsmall">
          <Glyphicon glyph="option-horizontal" style={{color: "#bbb", fontSize: "16px"}} />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <MenuItem eventKey="1" disabled={props.result.matches.bookmarked} 
            onSelect={() => { props.addBookmark(props.result.uri) }}>Bookmark</MenuItem>
          <MenuItem eventKey="2" disabled={!props.result.matches.bookmarked}
            onSelect={() => { props.removeBookmark(props.result.uri) }}>Unbookmark</MenuItem>
          <MenuItem divider />
          <MenuItem eventKey="3"
            onSelect={() => { props.searchForSimilar({
              authors: props.result.matches.authors,
              businesses: props.result.matches.organizations,
              keywords: props.result.matches.keywords,
              docId: props.result.matches.docId,
            }) }}>Find more like this</MenuItem>
          <MenuItem divider />
          <MenuItem eventKey="4"
            onSelect={() => { props.history.push(`/contribute/edit?uri=${props.result.uri}`) }}>Edit</MenuItem>
        </Dropdown.Menu>
      </Dropdown>
    </div>
    <div>
      {/* <h2 style={{ fontSize: '14px', fontWeight: '100', margin: '12px 0 0 0' }}>{ props.result.matches ? (props.result.matches.manufacturer || props.result.matches.productInfo.manufacturer) : "Unknown" }</h2> */}
    </div>
    <h4 style={{ margin: '3px 0 9px 0', fontWeight: '900', fontSize: '20px'}}>
      {
        (props.result.matches && props.result.matches.bookmarked) ? <Glyphicon glyph="star" style={{fontSize: "16px", marginRight: '4px', color: '#ffdf00'}} /> : null
      }
      <Link style={{textDecoration: 'none'}} to={{
        pathname: props.detailPath,
        state: { uri: props.result.uri },
        search: '?uri=' + props.result.uri
      }}>
        {
          props.result.matches ? (props.result.matches.model || props.result.matches.productInfo.model) : 
          props.result.label || getFilename(props.result.uri) || props.result.uri
        }
      </Link>
    </h4>
    <div className="ml-search-result-metadata">
      { props.result.matches && displayMetadata(props.result.matches) }
    </div>
    {
      props.displayAbstract && props.result.matches && props.result.matches.description &&
      <p>{ props.result.matches.description }</p>
    }
    <Link style={{textDecoration: 'none'}} to={{
      pathname: props.detailPath,
      state: { uri: props.result.uri },
      search: '?uri=' + props.result.uri
    }}>
      {/* <div style={{width: "auto", height: "160px", padding: "6px 0 12px 0"}}>
        {
          (props.result.matches.thumbnail || (props.result.matches.productInfo && props.result.matches.productInfo.thumbnail.uri)) ?  
          <img style={imageTagStyleProps} src={'/v1/documents?uri='+(props.result.matches.thumbnail || props.result.matches.productInfo.thumbnail.uri)} alt={ props.result.matches.manufacturer || props.result.matches.productInfo.manufacturer }></img> : 
          <div style={imageContent}><span>No Preview</span></div>
        }
        
      </div> */}
    </Link>
  </Col>
};

export default withRouter(CardResult);