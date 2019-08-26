import { LOGIN } from './types'

export const login = (email, password) => (dispatch) => {   
        const url = '/api/users/'
        const data = {
            email: email,
            password: password
        }
        fetch(url, {
                    method:'POST', 
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                   })
        .then((res) => res.json())
        .then((response) => dispatch(
            {
                type: LOGIN,
                payload: response,
                email: email
            }
        ))
        ;
}