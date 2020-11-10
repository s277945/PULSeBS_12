import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import { Login } from './pages/Login'

// create a user context for accessing user data from all pages and components
const MainContext = React.createContext();

class App extends Component {
  state = {
      userName: null,
      userType: null
  }

  componentDidMount(){
    let userN = sessionStorage.getItem("userName");
    if (userN) {
      this.setState({userName: userN});
      let userT = sessionStorage.getItem("userType");
      if (userT) this.setState({userType: userT});
    }
  }

  setUserName = (userN) => {
    this.setState({userName: userN});
  } 

  setUserType = (userT) => {
    this.setState({userType: userT});
  }

  render(){
  return <div className='App'>
      <Router>
        <MainContext.Provider value={{userName: this.state.userName, setUserName: this.setUserName, userType: this.state.UserType, setUserType: this.setUserType}}>
          <MainContext.Consumer>
            {(value)=>{
              console.log(value);
              return (
                  <Switch>
                    <Route path='/login'><Login context={value}/></Route>
                    <Route path='/studentHome'><studentHome context={value}/></Route>
                    <Route path='/teacherHome'><teacherHome context={value}/></Route>
                    <Route><Login context={value}/></Route>
                  </Switch>
              )             
            }}            
          </MainContext.Consumer>
        </MainContext.Provider>
      </Router>
    </div>
  }
}

export default App;