import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect} from 'react-router-dom'
import classNames from 'classnames'
import uuid from 'uuid'
import DragDropFiles from '../DragDropFiles/DragDropFiles'
import Spinner from '../Common/Spinner'
import paperclip from '../../imgs/paperclip.svg'
import trash from '../../imgs/trash.svg'
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
            files: [],
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
            files: [],
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

    addFiles = (e) => {
        var files = [];
        if(e.target.files.length>0)
        {
            files.push(e.target.files[0]);
            var checkedFiles = this.checkFilesExtAndSize(files);
            this.addFilesToState(checkedFiles);
        }
    }

    handleDragDropFile = (fileList) => {
        const files = [...fileList];
        var checkedFiles = this.checkFilesExtAndSize(files);
        this.addFilesToState(checkedFiles);        
    }

    checkFilesExtAndSize = (files) => {
        const sizeLimit = 5242880;
        const totalSizeLimit = 20971520;
        const fileTypes = [
            'image/png',
            'image/jpg',
            'image/jpeg',
            'image/gif',
            'application/zip',
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword'
        ];

        const fileSizes = this.state.files.map(file => file.size);
        var totalSize = fileSizes.reduce( (total, size) => total+size, 0);
        console.log(totalSize); 
        var checkedfiles = files.filter(file => {
            if(fileTypes.indexOf(file.type) !== -1 &&
               file.size <=sizeLimit && 
               file.size+totalSize <= totalSizeLimit)
            {   
                totalSize +=file.size;
                return file;
            }
            else {
                console.log(file, fileTypes.indexOf(file.type), file.type, file.size);
                alert(`Невозможно загрузить ${file.name}. Проверьте размер (< 5Мб) и тип файла. ${file.type}, ${file.size}`);
                return null;
            }
        })
        return checkedfiles;
    }

    addFilesToState = (files) => {
        if(files.length > 0)
        {
            this.setState({files: [...this.state.files, ...files]});
        }
    }

    deleteFile = (e, fileToDelete) => {
        e.preventDefault();
        const { files } = this.state;
        var newFiles = files.filter(file => file!== fileToDelete);
        this.setState({files: newFiles});
    }

    processFileName = (filename) => {
        const max_filename_length = 20;
        if(filename.length > max_filename_length) {
            let end = filename.slice(-4);
            let start = filename.slice(0,13);
            return start + '...' + end;
        }
        else {
            return filename;
        }   
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

        //const url_files = '/api/files/'

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
        //Submit files
        .then((res) => {
            const { files } = this.state;
            const method = 'PUT';
            if(files.length > 0 && memo_id === undefined) {
                if(res.hasOwnPropery('insertId')) {
                    memo_id = res.insertId;
                }
            }
            const files_url = '/api/files/'+memo_id;
            files.forEach(file => {
                fetch(files_url, {
                    method: method,
                    body: {
                        name: file.name,
                        contents: file 
                    }
                })
            })
        })
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
        const {subject, body, files, validationErrors, formIsValid, submitting, submitted, redirect} = this.state;
        const { loggedIn, user } = this.props;
        if(loggedIn && user !== undefined)
        {
        return (
            <div className={common.form__container}>
                <form>
                    <div className={common.form__group}>
                        <h2>{form.newHeader}</h2>
                        <p>{form.newText}</p>
                    </div>
                    <DragDropFiles handleDrop={this.handleDragDropFile}>
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
                        {    
                            files !== undefined && files.length > 0 && 
                                <div className={common.form__files}>
                                {
                                    files.map(file => {
                                        return (
                                            <div className={common.form__filecontainer} key={uuid.v4()}>
                                                <img src={paperclip} className={common.form__paperclipdesaturated} alt="paperclip" />
                                                <span className={common.form__filename} title={file.name}>
                                                    {this.processFileName(file.name)}
                                                </span>
                                                <span className={common.form__filedelete}
                                                    onClick={(e) => this.deleteFile(e, file)}>
                                                    <img src={trash} alt="Удалить" />
                                                    Удалить
                                                </span>
                                            </div>
                                        )
                                    })
                                }
                                </div>   
                        }
                        <label htmlFor="files" 
                                    className={common.form__label}>
                                    <img src={paperclip} alt="paperclip" />
                                    <span className={classNames(common.form__label, common.form__labelblue, common.form__link)}>
                                        {form.attach}
                                    </span> 
                        <input 
                            type="file"
                            className={common.form__filebutton}  
                            placeholder={form.subjectPlaceholder}
                            id="files"
                            name="files"
                            onChange={this.addFiles}
                        />
                        </label>
                                
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
                    </DragDropFiles>
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
