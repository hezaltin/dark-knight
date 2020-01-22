import React, { Component } from 'react'
import {Image, Thumbnail, Col, Row} from 'react-bootstrap'
import { withRouter } from 'react-router-dom';
import {connect} from 'react-redux'
import {getManufacturer, getTechnology} from '../../redux/home/homeAction'

class Manufacturer extends Component {
    clickHandler = () => {
        let path = '/home/manufacturers/profile'
        this.props.getManufacturer(this.props.name)
        this.props.getTechnology(this.props.technology)
        if(this.props.name !== "More..."){
            this.props.history.push(path)
        }else{
            this.props.getTechnology(this.props.technology)
            this.props.history.push('/home/manufacturers')
        }
    }
    render() {
        return (
            <div>
                <Col xs={2}>
                    <Thumbnail className = "manufacturer" style = {{cursor: "pointer", border: "none"}} onClick = {this.clickHandler}>
                        <div style = {{display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: this.props.height, backgroundColor: "#fff"}}>
                            <Image src = {this.props.img} style={{maxWidth: "100%", maxHeight: "100%"}}></Image>
                        </div>
                        <h4 className = "text-center">{this.props.name}</h4>
                    </Thumbnail>
                </Col>
            </div>
        )
    }
}

export default withRouter(connect(null, {getManufacturer, getTechnology})(Manufacturer))
