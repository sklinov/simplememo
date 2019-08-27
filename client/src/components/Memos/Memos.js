import React, { Component } from 'react'
import { connect } from 'react-redux'
import Memo from './Memo'
import { form } from '../Common/form'
import common from '../../styles/common.module.css'

class Memos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            memos: [],
            isLoading: true,
            isLoaded: false
        }
    }

    componentDidMount() {
        this.loadMemos();
    }
    componentDidUpdate(prevProps) {
        if (this.props.memoReloadTrigger !== prevProps.memoReloadTrigger ||
            this.props.user !== prevProps.user) {
            this.loadMemos();
          }
    }

    loadMemos = () => {
        if(this.props.user && this.props.user.user_id !== undefined)
        {
            const { user_id } = this.props.user;
            var url = '/api/memos?user_id='+user_id;
            fetch(url, {method: 'GET',
                        headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
            }})
            .then(res => res.json())
            .then(data => this.setState({memos : data, isLoading: false, isLoaded: true}));
        }
    }

    deleteMemo = (memo_id) => {
        const url = '/api/memos/'+memo_id;
        fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        })
        .then((res) => res.json())
        .then((res) => {
            if(res.affectedRows > 0) {
                this.setState({isLoaded:false}, this.loadMemos)
            }
        })
    }


    render() {
        const { memos, isLoading } = this.state;
        const { loggedIn, user } = this.props;
        if(loggedIn && user !== undefined)
        {
            return (
                <div>
                    <div className={common.form__container}>
                        <div className={common.form__group}>
                        <h2>{form.memosHeader}</h2>
                        </div>
                        {memos.length > 0 &&
                        <div>
                            {
                                memos.map(memo => (
                                    <Memo memo={memo} key={memo.memo_id} onDelete={this.deleteMemo}/>
                                ))
                            }
                        </div>  
                        }
                    
                        {
                        memos.length === 0 && isLoading === false &&
                        <div className={common.form__group}>
                            У вас пока нет заметок
                        </div>
                        }
                        {
                        isLoading &&
                        <div className={common.form__group}>
                            Загрузка...
                        </div>
                        }
                    </div>
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
    user: state.login.user,
    memoReloadTrigger: state.memo.memoReloadTrigger
})

export default connect(mapStateToProps ,{})(Memos); 