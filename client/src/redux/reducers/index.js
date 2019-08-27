import { combineReducers } from 'redux'
import loginReducer from './loginReducer'
import memoReducer from './memoReducer'

export default combineReducers({
    login: loginReducer,
    memo: memoReducer
})