import React from 'react'
import PropTypes from 'prop-types'

class FacetSearch extends React.Component {
  constructor(props) {
    super(props)
    this.state = { searchBoxVisible: false }
    this.showSearchBox = this.showSearchBox.bind(this)
    this.hideSearchBox = this.hideSearchBox.bind(this)
    this.blurHandler = this.blurHandler.bind(this)
  }

  showSearchBox() {
    this.setState({searchBoxVisible: true})
  }

  hideSearchBox() {
    this.setState({searchBoxVisible: false})
    this.input = null
  }

  componentDidUpdate() {
    if (this.state.searchBoxVisible) {
      console.log('focus')
      this.input.focus()
    }
  }

  blurHandler() {
    if (this.input.value === '') {
      this.hideSearchBox()
    }
  }

  render() {
    return this.state.searchBoxVisible ? 
    <div className='search-box' 
      style={{position: "absolute", right: "4px", fontSize: "14px", marginTop: "-2px"}}>
      <input style={{height: '18px', width: '100%', maxWidth: '128px', border: 0}}
        ref={(input) => { this.input = input }}
        onBlur={this.blurHandler}
        className="form-control input-sm" id="focusedInput" type="text" placeholder="Search..."></input>
    </div> : 
    <div className="search-icon" 
      style={{position: "absolute", right: 0, fontSize: "14px", marginTop: "-2px"}}>
      <i className="glyphicon glyphicon-search" title="Click to search"
        style={{ cursor: 'pointer', color: '#fff', padding: "0 12px" }}
        onClick={this.showSearchBox}
        ></i>
    </div>
  }
}

export default FacetSearch