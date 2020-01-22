import React, { Component } from 'react'
import {connect} from 'react-redux'
import { withRouter } from 'react-router-dom';
import {Image, Thumbnail, Col, Row} from 'react-bootstrap'
import Manufacturer from './Manufacturer'
import './Manufacturer.css'

class Manufacturers extends Component {
    render() {
        var imgs = [{name: "Toray", img: "https://bloximages.newyork1.vip.townnews.com/stltoday.com/content/tncms/assets/v3/editorial/2/0b/20b9a4de-bb8e-51ca-8811-79009601373d/5a1d4cb735d77.image.jpg"}, {name: "Hydranautics", img: "http://membranes.com/wp-content/uploads/2015/04/hydranautics-logo-1.png"}, {name: "LG Chem", img: "https://thumbor.forbes.com/thumbor/416x416/filters%3Aformat%28jpg%29/https%3A%2F%2Fi.forbesimg.com%2Fmedia%2Flists%2Fcompanies%2Flg-chem_416x416.jpg"}, {name: "Lanxess", img: "https://dev.rodpub.com/images/184/684_main.jpg"}, {name: "Suez", img: "https://media.licdn.com/dms/image/C4D0BAQGvuEpZCYmvnA/company-logo_200_200/0?e=2159024400&v=beta&t=WDL_5pvov0Vjse6dCyivNNQi4v2ocqa59a5TaL92dJ4"}, {name: "CSM", img: "https://media.glassdoor.com/sqll/611071/csm-woongjin-chemical-squarelogo-1541171085030.png"}, {name: "Vontron", img: "https://d26zrrb868k3tz.cloudfront.net/system/yearbook_entries/logos/000/008/539/original/Vontron_logo_2017.png?1548089014"}, {name: "Lanxess", img: "https://dev.rodpub.com/images/184/684_main.jpg"},{name: "Lanxess", img: "https://dev.rodpub.com/images/184/684_main.jpg"},{name: "Lanxess", img: "https://dev.rodpub.com/images/184/684_main.jpg"},{name: "Lanxess", img: "https://dev.rodpub.com/images/184/684_main.jpg"},{name: "Hydranautics", img: "http://membranes.com/wp-content/uploads/2015/04/hydranautics-logo-1.png"},{name: "Hydranautics", img: "http://membranes.com/wp-content/uploads/2015/04/hydranautics-logo-1.png"},{name: "Hydranautics", img: "http://membranes.com/wp-content/uploads/2015/04/hydranautics-logo-1.png"},{name: "Hydranautics", img: "http://membranes.com/wp-content/uploads/2015/04/hydranautics-logo-1.png"}]

        var mapImgs = imgs.map((el, i) => {
            return(
                <Manufacturer img = {el.img} name = {el.name} technology = {this.props.technology} key = {i} height = "100px"></Manufacturer>
            )
        })

        console.log(this.props.technology, 'testing')
        return (
                <div>
                    {(this.props.technology !== '')?
                        <div className = "container">
                            <h3>Technology: <strong>{this.props.technology}</strong></h3>
                            <Row>
                                {mapImgs}
                            </Row>
                        </div>
                    :
                       this.props.history.push('/home')
                    }
                </div>

 
        )
    }
}

const mapStateToProps = state => ({
    technology: state.home.technologySelected,
})

export default withRouter(connect(mapStateToProps, null)(Manufacturers))