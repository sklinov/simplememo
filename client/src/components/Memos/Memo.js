import React, { Component } from 'react'
import { connect } from 'react-redux'
import { memoEdit } from '../../redux/actions/memoActions'
import classNames from 'classnames'
import common from '../../styles/common.module.css'
import styles from './Memo.module.css'
import trash from '../../imgs/trash.svg'
import edit from '../../imgs/edit.svg' 

class Memo extends Component {
    
    deleteMemo = (e, memo_id) => {
        e.preventDefault();
        this.props.onDelete(memo_id);
    }

    editMemo = (e, memo) => {
        e.preventDefault();
        this.props.memoEdit(memo);
    }

    render() {
        const {memo} = this.props;
        return (
            <div className={classNames(common.form__group, styles.item__container)} key={memo.memo_id}>
                <h3>{memo.subject}</h3>
                <p>{memo.body}</p>
                <div className={styles.container__controls}>
                    <span className={classNames(common.form__edit, styles.link)}
                                    onClick={(e) => this.editMemo(e, memo)}>
                                    <img src={edit} className={common.form__icon} alt="Редактировать" />
                                    Редактировать
                    </span>
                    <span className={common.form__filedelete}
                                    onClick={(e) => this.deleteMemo(e, memo.memo_id)}>
                                    <img src={trash} className={common.form__icon} alt="Удалить" />
                                    Удалить
                    </span>
                </div>

            </div>
        )
    }
}

export default connect(null ,{memoEdit})(Memo); 