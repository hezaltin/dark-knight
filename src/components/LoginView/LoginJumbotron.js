import React from 'react';
import { Row, Col, Jumbotron } from 'react-bootstrap';
import Login from './Login';
import './LoginJumbotron.css'

const LoginJumbotron = props => (
  <>
    <div className={'login-background'} style={{backgroundImage: `url('/background/${process.env.REACT_APP_ID}-background.png')` }}></div>
    <Row style={{ marginTop: '150px' }}>
      <Col md={4} mdOffset={4}>
        {/* <img
          src="/odis.svg" alt="O.D.I.S."
          style={{ width: '80%' }}
        /> */}
        
      </Col>
    </Row>
    <Row>
      <Col md={4} mdOffset={4}>
        <Jumbotron style={{backgroundColor: 'rgba(244,244,244,0.8)'}}>
        <h4>Log in using your epass ID and password.</h4>
          <Login {...props} />
        </Jumbotron>
      </Col>
    </Row>
  </>
);

export default LoginJumbotron;