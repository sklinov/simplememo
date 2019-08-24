import React, { Component } from 'react'
import classNames from 'classnames'
import uuid from 'uuid'
import DragDropFiles from '../DragDropFiles/DragDropFiles'
import paperclip from '../../imgs/paperclip.svg'
import trash from '../../imgs/trash.svg'
import {form} from '../Common/form'
import {leftSideTrim, validateField} from '../../utils/index'
import common from '../../styles/common.module.css'


export default class New extends Component {
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

    render() {
        const {subject, body, files, validationErrors, formIsValid} = this.state;
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
                    </div>
                    </DragDropFiles>
                </form>   
            </div>
        )
    }
}
