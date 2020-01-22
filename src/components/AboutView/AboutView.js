import React from 'react'
import { Row, Col } from 'react-bootstrap';
import { Switch, Route, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'
import Team from './Team'

class AboutView extends React.Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    return (
      <>
      {/* <h1>hi</h1>
      <div>

        <Route exact 
          path={`${this.props.match.url}/team`} 
          component={Team}/>

      </div> */}
    <Row>
      <Col md={6} mdOffset={3}>
        <img
          src="/assets/chatbot.png"
        />
      </Col>
    </Row>
      </>
    )
  }
}

AboutView.propTypes = process.env.NODE_ENV !== "production" ? {

} : {}

export default AboutView
