import {FETCH_TECHNOLOGY, FETCH_MANUFACTURER} from './actionTypes'

const initialState = {
    technologySelected: "",
    manufacturerSelected: ""
}

export default function(state = initialState, action){
    switch(action.type){
        case FETCH_TECHNOLOGY:
            return {
                ...state,
                technologySelected: action.payload
            }
        case FETCH_MANUFACTURER:
            return {
                ...state,
                manufacturerSelected: action.payload
            }
        default: 
            return state;
    }
}