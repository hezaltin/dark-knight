import React, { Component } from 'react'
import test from './test.jpg'
import {Col, Button, Thumbnail, Image} from 'react-bootstrap'
import { withRouter } from 'react-router-dom';
import {connect} from 'react-redux'
import {getTechnology} from '../../redux/home/homeAction'
import './Technology.css'


class Technology extends Component {
    routeChange = () => {
        let path = '/home/manufacturers'
        this.props.getTechnology(this.props.name)
        this.props.history.push(path)
    }
    render() {
        return (
            <Col xs={3}>
                <Thumbnail>
                    <Image  style = {{width: "100%", height: "250px" }} src = {this.props.img} />
                    <h3>{this.props.name}</h3>
                    <p>{this.props.desc}</p>
                    <Button className = "technology-button" onClick = {this.routeChange} bsSize = "small" bsStyle='primary'>More</Button>
                </Thumbnail>
            </Col>
        )
    }
}



export default withRouter(connect(null, {getTechnology})(Technology))


