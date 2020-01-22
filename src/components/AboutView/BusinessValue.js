import React, { Component } from 'react'
import {Image, Thumbnail, Col, Row} from 'react-bootstrap'
import { withRouter } from 'react-router-dom'
import {connect} from 'react-redux'

class BusinessValue extends Component {

  render() {
    return <>
      <h2 style={{textAlign: 'center', color: '#999'}}>Sorry. This section is still under development</h2>
      <Row>
          <Col xs={8} mdOffset={2}>
            {/* <center>
              <img src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRbezqZpEuwGSvitKy3wrwnth5kysKdRqBW54cAszm_wiutku3R" name="aboutme" width="140" height="140" border="0" class="img-circle"/>
              <h3 class="media-heading">Joe Sixpack <small>USA</small></h3>
              <span><strong>Skills: </strong></span>
                <span class="label label-warning">HTML5/CSS</span>
                <span class="label label-info">Adobe CS 5.5</span>
                <span class="label label-info">Microsoft Office</span>
              <span class="label label-success">Windows XP, Vista, 7</span>
            </center> */}
        {/* <img
          src="/assets/compliance.png"
          style={{width: '100%'}}
        /> */}
          </Col>
      </Row>
    </>
  }
}

export default withRouter(connect(null, {})(BusinessValue))
