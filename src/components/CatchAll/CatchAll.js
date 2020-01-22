import React from 'react'
import './CatchAll.css'
import {Button} from 'react-bootstrap'

const CatchAll = (props) => {
    return(
        <div className = "container container-catchall">
            <div className = "center-catchall">
                <h1 className = "four-zero-four">4<span id="zero">0</span>4</h1>
                <h2 style = {{textAlign: 'center'}}>SORRY, PAGE NOT FOUND</h2>
                <a href="/home" style = {{float: 'right'}}>Back Home...</a>
            </div>
        </div>
    )
}

export default CatchAll