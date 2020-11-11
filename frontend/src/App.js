import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Login } from './pages/Login'
import { StudentHome } from './pages/studentHome'
import { TeacherHome } from './pages/teacherHome'

// create a user context for accessing user data from all pages and components
const MainContext = React.createContext();

class App extends Component {
  state = {
      userName: "",
      userType: ""
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
        <MainContext.Provider value={{userName: this.state.userName, userType: this.state.userType, setUserName: this.setUserName, setUserType: this.setUserType}}>
          <MainContext.Consumer>
            {(value)=>{
              console.log(value);
              return (
                  <Switch>
                    <Route path='/login'  render={(props) => (<Login {...props} context={value}/>)}></Route>
                    <Route path='/studentHome' render={(props) => (<StudentHome {...props} context={value}/>)}></Route>
                    <Route path='/teacherHome'><TeacherHome context={value}/></Route>
                    <Route render={(props) => (<Login {...props} context={value}/>)}></Route>
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