import React, { Component } from 'react'
import {form} from '../Common/form'
import {leftSideTrim, validateField} from '../../utils/index'
import common from '../../styles/common.module.css'

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            validationErrors: {
                email: false,
                password: false,
            },
            formIsValid: false 
        }
        this.validateField = validateField.bind(this, this.state)
    }

    handleChange = (e) => {
        e.preventDefault();
        const value = leftSideTrim(e.target.value);
        const { validationErrors } = this.state;
        this.setState({ validationErrors: {...validationErrors, [e.target.name]: false} }); 
        this.setState({ [e.target.name] : value });
        this.validateForm();
    }

    validateForm = () => {
        const { email, password, validationErrors } = this.state;
        if(
            email.length > 0 &&
            password.length > 0 &&
            Object.values(validationErrors).every(error => error === false)
        ) {
            this.setState({formIsValid: true}); 
        }
        else {
            this.setState({formIsValid: false}); 
        }
    }

    render() {
        const {email, password, validationErrors, formIsValid } = this.state;
        return (
            <div className={common.form__container}>
                <form>
                    <div className={common.form__group}>
                    <h2>{form.loginHeader}</h2>
                    <p>{form.loginText}</p>
                    </div>
                    <div className={common.form__group}>
                        <label htmlFor="email"
                            className={common.form__label}>
                            {form.emailLabel}
                        </label>
                        <br />
                        <input 
                            type="email"
                            className={common.form__input}  
                            placeholder={form.emailPlaceholder}
                            name="email"
                            value={email} 
                            onChange={this.handleChange}
                            onBlur={(e) => this.validateField(e)}
                            data-test="email" 
                        />
                        <div className={common.form__errorcontainer}>
                            <div className={common.form__error}>{validationErrors.email}</div>
                        </div>    
                    </div>
                    <div className={common.form__group}>
                        <label htmlFor="password"
                            className={common.form__label}>
                            {form.passwordLabel}
                        </label>
                        <br />
                        <input 
                            type="password"
                            className={common.form__input}
                            placeholder={form.passwordPlaceholder}  
                            name="password"
                            value={password} 
                            onChange={this.handleChange}
                            onBlur={(e) => this.validateField(e)}
                            data-test="password" 
                        />
                        <div className={common.form__errorcontainer}>
                            <div className={common.form__error}>{validationErrors.password}</div>
                        </div>    
                    </div>
                    <div className={common.form__group} data-test="form__group">
                        <button
                            className={common.form__button}
                            onClick={this.submitForm}
                            disabled={!formIsValid}
                        >
                            {form.loginButtonLabel}
                        </button>
                    </div>
                </form>
            </div>
        )
    }
}
