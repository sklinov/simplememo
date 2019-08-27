import { MEMO_SUBMIT, MEMO_EDIT } from '../actions/types'

const initialState = {
    memoReloadTrigger: false,
    memoToEdit: {}
}

export default function(state = initialState, action) {
    switch(action.type) {
        case MEMO_SUBMIT:
            return {
                ...state,
                memoReloadTrigger: !state.memoReloadTrigger
            }
        case MEMO_EDIT: 
            return {
                ...state,
                memoToEdit: action.payload
            }
        default:
            return state
    }
}