import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { Switch, Route } from 'react-router-dom'

import { General } from './pages/General'


class App extends Component {

  render(){
  return <div className='App'>
      <Switch>
        <Route path='/general' component={General}></Route>
        <Route component={General}></Route>
      </Switch>
    </div>
  }
}

export default App;
