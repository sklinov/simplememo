import React from 'react'
import spinner from '../../imgs/loading.png'
import styles from './Spinner.module.css'


export default function Spinner() {
    return (
        <div>
                <img 
                    src={spinner}
                    alt="Loading..."
                    className = {styles.spinner} />    
            </div>
    )
}
