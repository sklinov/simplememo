import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'

import { connect } from 'react-redux'
import { login, logout } from '../../redux/actions/loginActions'

import classNames from 'classnames'
import {form} from '../Common/form'
import {errors} from '../Common/errors'
import {leftSideTrim, validateField} from '../../utils/index'
import common from '../../styles/common.module.css'

// const initialState = {
//     email: "",
//     password: "",
//     validationErrors: {
//         email: false,
//         password: false,
//     },
//     formIsValid: false 
// }

class Login extends Component {
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

    submitForm = (e) => {
        e.preventDefault();
        this.props.login(this.state.email, this.state.password);
    }

    logOut = (e) => {
        e.preventDefault();
        this.setState({email: "",
                        password: "",
                        validationErrors: {
                            email: false,
                            password: false,
                        },
                        formIsValid: false}, 
                        this.props.logout());   
    }

    render() {
        const { email, password, validationErrors, formIsValid } = this.state;
        const { loggedIn, wrongPassword, user} = this.props;
        if(!loggedIn)
        {
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
                        {
                            wrongPassword && 
                            <div className={common.form__group} data-test="form__group">
                                <div className={common.form__errorcontainer}>
                                    <div className={common.form__error}>{errors.wrongPassword}</div>
                                </div>
                            </div>
                        }
                        
                        

                    </form>
                </div>
                
            )
        }
        else if(loggedIn) {
            return (
                <div className={common.form__container}>
                    <div className={classNames(common.form__group, common.form__groupdistibuted)}>
                        <div>
                            {form.enteredAs}{user.email}
                            <button className={common.form__button} style={{marginLeft: '20px'}} onClick={(e) => this.logOut(e)}> {form.logoutButtonLabel} </button>
                        </div>
                        <Link to='/new'>
                            <button className={common.form__button} > {form.addNewButtonInHeaderLabel} </button>
                        </Link>
                    </div>
                    
                    <Redirect to='/memos'/>
                </div>
                
            )
            
        }
        
    }
}

const mapStateToProps = state => ({
    loggedIn: state.login.loggedIn,
    wrongPassword: state.login.wrongPassword, 
    user: state.login.user
})

export default connect(mapStateToProps ,{login, logout})(Login); 