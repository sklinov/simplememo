import { errors } from '../components/Common/errors'

export const leftSideTrim = (value) => {
    if(value === null) 
    { 
        return value;
    }
    return value.replace(/^\s+/g, '');
}

export const validateField = function(state,e) {
    e.preventDefault();
    const { value, name } = e.target;
    const { validationErrors } = this.state;
    switch(name) {
        case name.match(/(Email)/i) && name:
            if(value.length === 0) {
                this.setState({ validationErrors: {...validationErrors, [name]: errors.emailEmpty} }); 
            }
            else if(!value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
                this.setState({ validationErrors: {...validationErrors, [name]: errors.emailNotValid} }); 
            }
            break;
        case name.match(/(password)/i) && name:
            if(value.length === 0) {
                this.setState({ validationErrors: {...validationErrors, [name]: errors.passwordEmpty} }); 
            }
            else if(value.length < 5) {
                this.setState({ validationErrors: {...validationErrors, [name]: errors.passwordTooShort} }); 
            }
            break;
        case name.match(/(subject)/i) && name:
            if(value.length === 0) {
                this.setState({ validationErrors: {...validationErrors, [name]: errors.subjectEmpty} }); 
            }
            break;
        case name.match(/(body)/i) && name:
            if(value.length === 0) {
                this.setState({ validationErrors: {...validationErrors, [name]: errors.bodyEmpty} }); 
            }
            break;
        default:
            break;
    }
}