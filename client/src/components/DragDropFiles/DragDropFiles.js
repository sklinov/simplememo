import React, { Component } from 'react'
import { dragdrop } from '../../languages/ru'
import styles from './DragDropFiles.module.css'

export default class DragDropFiles extends Component {
    state = {
        drag: false
      }

    dropRef = React.createRef();

    handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
    }

    handleDragIn = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.dragCounter++;
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            this.setState({drag: true});
        }
    }
    
    handleDragOut = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.dragCounter--
        if (this.dragCounter === 0) {
          this.setState({drag: false});
        }
    }

    handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({drag: false});
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            this.props.handleDrop(e.dataTransfer.files);
            e.dataTransfer.clearData();
            this.dragCounter = 0;
        }
    }
    componentDidMount() {
        let div = this.dropRef.current;
        div.addEventListener('dragenter', this.handleDragIn);
        div.addEventListener('dragleave', this.handleDragOut);
        div.addEventListener('dragover', this.handleDrag);
        div.addEventListener('drop', this.handleDrop);
    }

    componentWillUnmount() {
        let div = this.dropRef.current;
        div.removeEventListener('dragenter', this.handleDragIn);
        div.removeEventListener('dragleave', this.handleDragOut);
        div.removeEventListener('dragover', this.handleDrag);
        div.removeEventListener('drop', this.handleDrop);
    }
      render() {
        const heading = 'Бросайте файлы сюда, я ловлю';
        const text = 'Мы принимаем картинки (jpg, png, gif), офисные файлы (doc, xls, pdf) и zip-архивы. Размеры файла до 5 МБ';

        return (
          <div className={styles.dragdrop__block} ref={this.dropRef}>
            {this.state.drag &&
              <div className={styles.dragdrop__border}>
                <div className={styles.dragdrop__fill}>
                  <h1 className={styles.dragdrop__heading}>{heading}</h1>
                  <p className={styles.dragdrop__text}>{text}</p>
                </div>
              </div>
            }
            {this.props.children}
          </div>
        )
      }
}
