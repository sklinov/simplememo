import React from 'react';
import { Router, Route } from "react-router-dom";
import { createBrowserHistory} from "history";

import './App.css';
import Login from './components/Login/Login';
import Memos from './components/Memos/Memos';
import New from './components/New/New';
import Logo from './components/Logo/Logo';

const history = new createBrowserHistory();

function App() {
  return (
    <Router history={history}>
      <div className="App">
        <Logo />
        <Route path='/' component={Login} />
        <Route path='/memos' component={Memos} />
        <Route path='/new' component={New} />     
      </div>
    </Router>
  );
}

export default App;
