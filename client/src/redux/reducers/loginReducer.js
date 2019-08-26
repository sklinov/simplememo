import { LOGIN } from '../actions/types'

const initialState = {
    loggedIn: false,
    wrongPassword: false,
    user: {}
}

export default function(state = initialState, action) {
    switch(action.type) {
        case LOGIN:
            if(action.payload.hasOwnProperty('auth') && action.payload.auth === true)
            {
              return {
                  ...state,
                  loggedIn: true,
                  user: {
                      user_id: action.payload.user_id,
                      email: action.payload.email
                  } 
              }  
            }
            else if(action.payload.hasOwnProperty('auth') && action.payload.auth === false)
            {
                return {
                    ...state,
                    loggedIn: false,
                    wrongPassword: true
                }
            }
            else if(action.payload.hasOwnProperty('affectedRows') && action.payload.affectedRows === 1)
            {
                return {
                    ...state,
                    loggedIn: true,
                    user: {
                        user_id: action.payload.insertId,
                        email: action.email
                    }
                }
            }
            break;
        default:
            return state
    }
}