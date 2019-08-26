import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect} from 'react-router-dom'
import classNames from 'classnames'
import Spinner from '../Common/Spinner'
import success from '../../imgs/checked.svg'
import {form} from '../Common/form'
import {leftSideTrim, validateField} from '../../utils/index'
import common from '../../styles/common.module.css'


class New extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subject: '',
            body: '',
            validationErrors: {
                subject: false,
                body: false,
            },
            formIsValid: false,
            submitting: false,
            submitted: false,
            redirect: false,
        }
        this.validateField = validateField.bind(this, this.state)
    }

    componentDidMount() {
        const memo = this.props.location.state !== undefined ? this.props.location.state.memo : undefined ;
        if(memo !== undefined) {
            this.setState({
                subject: memo.subject,
                body: memo.body,
                files: memo.files
            });
        }
    }

    clearForm = () => {
        this.setState({
            subject: '',
            body: '',
            validationErrors: {
                subject: false,
                body: false,
            },
            formIsValid: false,
        });
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
        const { subject, body, validationErrors } = this.state;
        if(
            subject.length > 0 &&
            body.length > 0 &&
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
        this.setState({submitting: true});
        const { user_id } = this.props.user;
        const { subject, body } = this.state;

        const {memo_id} = this.props.location.state !== undefined ? this.props.location.state.memo : undefined ;
        console.log(memo_id);

        var method;
        var url_memos;
        var data;

        if(this.props.user.user_id !== undefined && memo_id === undefined) {
            url_memos = '/api/memos/';
            method = 'PUT';
            data = {
                user_id: user_id,
                subject: subject,
                body: body,
            };
        }
        else if (this.props.user.user_id !== undefined && memo_id !== undefined) {
            url_memos = '/api/memos/'+memo_id;
            method = 'POST'
            data = {
                memo_id: this.props.memo_id,
                subject: subject,
                body: body,
            };
        }
        //Submit form 
        fetch(url_memos, {
            method: method,
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((res) => res.json())
        .then((res) => {
            this.clearForm();
            this.setState({submitting: false, submitted: true},
                this.redirection
            )
        })
    }

    redirection = () => {
        setTimeout(() => this.setState({redirect:true}) , 5000)
    }

    render() {
        const {subject, body, validationErrors, formIsValid, submitting, submitted, redirect} = this.state;
        const { loggedIn, user } = this.props;
        if(loggedIn && user !== undefined)
        {
        return (
            <div className={common.form__container}>
                <form>
                    <div className={common.form__group}>
                        <h2>{form.newHeader}</h2>
                    </div>
                    <div className={common.form__group}>
                        <label htmlFor="subject"
                            className={common.form__label}>
                            {form.subjectLabel}
                        </label>
                        <br />
                        <input 
                            type="text"
                            className={common.form__input}  
                            placeholder={form.subjectPlaceholder}
                            name="subject"
                            value={subject} 
                            onChange={this.handleChange}
                            onBlur={(e) => this.validateField(e)}
                            data-test="subject" 
                        />
                        <div className={common.form__errorcontainer}>
                            <div className={common.form__error}>{validationErrors.subject}</div>
                        </div>    
                    </div>
                    <div className={common.form__group} data-test="form__group">
                        <label htmlFor="body"
                                className="form__label">
                                {form.bodyLabel}
                        </label>
                    <br />
                        <textarea 
                            className={classNames(common.form__input, common.form__inputfullwidth, common.form__inputtextarea)}
                            placeholder={form.bodyPlaceholder}
                            name="body"
                            value={body} 
                            onChange={this.handleChange}
                            onBlur={(e) => this.validateField(e)} 
                        />
                        <div className={common.form__errorcontainer}>
                            <div className={common.form__error}>{validationErrors.body}</div>
                        </div>
                    </div>

                    <div className={common.form__group} data-test="form__group">
                            <button
                                className={common.form__button}
                                onClick={this.submitForm}
                                disabled={!formIsValid}
                            >
                                {form.addNewButtonLabel}
                            </button>
                            {
                                submitting && <Spinner />
                            }
                            {
                                submitted && 
                                <React.Fragment>
                                    <img src={success} className={common.form__iconlarge} alt='Заметка добавлена' />
                                    <span>{form.redirect}</span>
                                </React.Fragment>
                            }
                            {
                                redirect && <Redirect to='/memos' />
                            }
                    </div>
                </form>   
            </div>
        )
    }
    else {
        return null;
    }
    }
}

const mapStateToProps = state => ({
    loggedIn: state.login.loggedIn,
    user: state.login.user
})

export default connect(mapStateToProps ,{})(New); 
