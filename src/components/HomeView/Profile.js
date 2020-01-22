import React, { Component } from 'react'
import {connect} from 'react-redux'
import { withRouter } from 'react-router-dom';
import {Tab, Tabs} from 'react-bootstrap'


class Profile extends Component {
    render() {
        return (
            <div>
                {(this.props.manufacturer !== '') ?
                    <div>
                        <h3>Manufacturer: <strong>{this.props.manufacturer}</strong></h3>
                        <Tabs defaultActiveKey={1}>
                            <Tab eventKey = {1} title = "Profile">
                                <h2>Under development</h2>
                            </Tab>
                        <Tab eventKey = {2} title = "Warranty Terms">
                            Content
                        </Tab>
                        <Tab eventKey = {3} title = "Links">
                            Content
                        </Tab>
                        </Tabs>
                    </div>
                :
                this.props.history.push('/home')
            }
            </div>
        )
    }
}

const mapStateToProps = state => ({
    manufacturer: state.home.manufacturerSelected,
    technology: state.home.technologySelected
})

export default withRouter(connect(mapStateToProps, null)(Profile))