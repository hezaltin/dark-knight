import {FETCH_TECHNOLOGY, FETCH_MANUFACTURER} from './actionTypes'

export const getTechnology = technologyName => dispatch => {
    dispatch({
        type: FETCH_TECHNOLOGY,
        payload: technologyName
    })
}

export const getManufacturer = companyName => dispatch => {
    dispatch({
        type: FETCH_MANUFACTURER,
        payload: companyName
    })
}