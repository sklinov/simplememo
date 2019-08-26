import React from 'react';
import { Router, Route } from "react-router-dom";
import { createBrowserHistory} from "history";
import { Provider } from 'react-redux';

import './App.css';
import Login from './components/Login/Login';
import Memos from './components/Memos/Memos';
import New from './components/New/New';
import Logo from './components/Logo/Logo';

import store from './redux/store'

const history = new createBrowserHistory();


function App() {
  return (
    <Provider store={store}>
      <Router history={history}>
        <div className="App">
          <Logo />
          <Route path='/' component={Login} />
          <Route path='/memos' component={Memos} />
          <Route path='/new' component={New} />     
        </div>
      </Router>
    </Provider>
  );
}

export default App;
