import React, { Component } from 'react'
import Manufacturer from './Manufacturer'
import {Row} from 'react-bootstrap'

export default class ManufacturersCarousel extends Component {
    render() {
        var manufacturers = this.props.manufacturers

        manufacturers.push({name: "More...", img: "http://www.mathmlcentral.com/characters/glyphs/Ellipsis_L.gif"})
        var mapImgs = manufacturers.map((el, i) => {
            return(
                <Manufacturer img = {el.img} name = {el.name} technology = {this.props.technology} height = "125px" key = {i}></Manufacturer>
            )
        })
        return (
            <div>
                <Row>
                    {mapImgs}
                </Row>
            </div>
        )
    }
}
