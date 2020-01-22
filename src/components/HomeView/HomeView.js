import React, { Component } from 'react'
import Technology from './Technology'
import {Row, Carousel} from 'react-bootstrap'
import { withRouter } from 'react-router-dom';
import {connect} from 'react-redux'
import Manufacturers from './Manufacturers'
import ManufacturersCarousel from './ManufacturersCarousel'
import {getTechnology} from '../../redux/home/homeAction'
import img from './test.jpg'
import {Typeahead} from 'react-bootstrap-typeahead'
import './HomeView.css'
import 'react-bootstrap-typeahead/css/Typeahead.css';


class Home extends Component {
    constructor(props){
        super(props)
        this.state = {
            value: ""
        }
    }


    handleChange = (val) => {
        this.props.getTechnology(val[0])
        this.props.history.push('/home/manufacturers')
    }


    render() {
        var test = [
            {
                name: "RO/NF", 
                img: "https://images.unsplash.com/photo-1565040466941-b3c799ead955?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjExMDk0fQ&auto=format&fit=crop&w=675&q=80", 
                desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                manufacturers: [{name: "Toray", img: "https://bloximages.newyork1.vip.townnews.com/stltoday.com/content/tncms/assets/v3/editorial/2/0b/20b9a4de-bb8e-51ca-8811-79009601373d/5a1d4cb735d77.image.jpg"}, {name: "Hydranautics", img: "http://membranes.com/wp-content/uploads/2015/04/hydranautics-logo-1.png"}, {name: "LG Chem", img: "https://thumbor.forbes.com/thumbor/416x416/filters%3Aformat%28jpg%29/https%3A%2F%2Fi.forbesimg.com%2Fmedia%2Flists%2Fcompanies%2Flg-chem_416x416.jpg"}, {name: "Lanxess", img: "https://dev.rodpub.com/images/184/684_main.jpg"}, {name: "Vontron", img: "https://d26zrrb868k3tz.cloudfront.net/system/yearbook_entries/logos/000/008/539/original/Vontron_logo_2017.png?1548089014"}, {name: "Aquatech", img: "/assets/aquatech.jpg"}, {name: "Marlo", img: "/assets/marlo.jpg"}]
            }, {
                name: "UF", 
                img: "https://images.unsplash.com/photo-1565022888585-5786a818c039?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80", 
                desc: "Vestibulum aliquam placerat nisi, ac rhoncus neque accumsan sed.",
                manufacturers: [{name: "GE", img: "https://upload.wikimedia.org/wikipedia/commons/f/ff/General_Electric_logo.svg"}, {name: "Suez", img: "https://media.licdn.com/dms/image/C4D0BAQGvuEpZCYmvnA/company-logo_200_200/0?e=2159024400&v=beta&t=WDL_5pvov0Vjse6dCyivNNQi4v2ocqa59a5TaL92dJ4"}, {name: "CSM", img: "https://media.glassdoor.com/sqll/611071/csm-woongjin-chemical-squarelogo-1541171085030.png"}, {name: "Vontron", img: "https://d26zrrb868k3tz.cloudfront.net/system/yearbook_entries/logos/000/008/539/original/Vontron_logo_2017.png?1548089014"}, {name: "Koch", img: "/assets/koch.jpg"}, {name:"Pall", img: "/assets/pall.jpg"}, {name:"Lenntech", img: "/assets/lenntech.png"}, {name:"Evoqua", img: "/assets/evoqua.jpg"}]
            }, {
                name: "IER", 
                img: "https://images.unsplash.com/photo-1565030275313-7ea3eb184423?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=676&q=80", 
                desc: "Quisque id orci lobortis, interdum quam vel, ullamcorper nisi.",
                manufacturers: [{name: "Hydranautics", img: "http://membranes.com/wp-content/uploads/2015/04/hydranautics-logo-1.png"}, {name: "LG Chem", img: "https://thumbor.forbes.com/thumbor/416x416/filters%3Aformat%28jpg%29/https%3A%2F%2Fi.forbesimg.com%2Fmedia%2Flists%2Fcompanies%2Flg-chem_416x416.jpg"}, {name: "Lanxess", img: "https://dev.rodpub.com/images/184/684_main.jpg"}, {name: "Suez", img: "https://media.licdn.com/dms/image/C4D0BAQGvuEpZCYmvnA/company-logo_200_200/0?e=2159024400&v=beta&t=WDL_5pvov0Vjse6dCyivNNQi4v2ocqa59a5TaL92dJ4"}, {name: "CSM", img: "https://media.glassdoor.com/sqll/611071/csm-woongjin-chemical-squarelogo-1541171085030.png"}, {name: "Mitsubishi", img: "/assets/misubishi.png"}, {name: "Purolite", img: "/assets/purolite.jpg"}, {name: "Resin Tech", img: "/assets/resintech.png"}]
            }
        ]
        // var mapTest = test.map((el,i) => {
        //     return(
        //         <Technology name = {el.name} img = {el.img} desc = {el.desc} key={i}></Technology>
        //     )
        // })



        var mapCarousel = test.map((el,i) => {
            return (
                <Carousel.Item key = {i}>
                    <ManufacturersCarousel technology = {el.name} manufacturers={el.manufacturers} height = "200px"/>
                    <h3 className = "text-right" style = {{marginRight: "10px", marginTop: "0px"}}>Technology: <strong>{el.name}</strong></h3>
                </Carousel.Item>
            )
        })

        var options = [
            'UF', 'IER', 'RO/NF'
          ];
        //   style = {{display: "block", width: "400px", height: "50px", textAlign: "left", background: "none", outline: "none", border: "none", borderRadius: "20px"}}
        return (
            <div className = "container">
                <form onSubmit = {this.handleSubmit}>
                    <Typeahead
                        options={options}
                        placeholder = "Search.."
                        // onKeyDown={(e) => {
                        //     if(e.keyCode == 13){
                        //         this.handleSubmit(e)
                        //     }
                        // }}
                        value = {this.state.value}
                        onChange = {val => this.handleChange(val)}
                        id={1}
                    />
                </form>
                <br/>
                {/* <Carousel className = "carousel">
                    {mapCarousel}
                </Carousel> */}
                <br/>
                {/* <Row>
                    {mapTest}
                </Row> */}
            </div>
        )
    }
}

export default withRouter(connect(null, {getTechnology})(Home))