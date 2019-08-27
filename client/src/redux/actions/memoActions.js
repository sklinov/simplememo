import { MEMO_SUBMIT, MEMO_EDIT } from './types'

export const memoSubmit = () => (dispatch) => {
    dispatch({
        type: MEMO_SUBMIT
    })
}

export const memoEdit = (payload) => (dispatch) => {
    dispatch({
        type: MEMO_EDIT,
        payload: payload
    })
}