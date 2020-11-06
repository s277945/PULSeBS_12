import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { Switch, Route } from 'react-router-dom'

import { Login } from './pages/Login'


class App extends Component {

  render(){
  return <div className='App'>
      <Switch>
        <Route path='/login' component={Login}></Route>
        <Route component={Login}></Route>
      </Switch>
    </div>
  }
}

export default App;
