import React from 'react';

import { Provider } from 'react-redux';

import './App.css';
import Login from './components/Login/Login';
import Memos from './components/Memos/Memos';
import New from './components/New/New';
import Logo from './components/Logo/Logo';

import store from './redux/store'

function App() {
  return (
    <Provider store={store}>
        <div className="App">
          <Logo />
          <Login />
          <New />
          <Memos />
        </div>
    </Provider>
  );
}

export default App;
