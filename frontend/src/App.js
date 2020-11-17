import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Login } from './pages/Login'
import { StudentHome } from './pages/studentHome'
import { TeacherHome } from './pages/teacherHome'

// create a user context for accessing user data from all pages and components
const MainContext = React.createContext();
const TITLE = "PULSeBS"
class App extends Component {
  state = {
      userName: null,   //user session context data
      userType: null
  }

  componentDidMount(){
    document.title = TITLE;
    let userN = sessionStorage.getItem("userName"); //check for stored user session data
    if (userN) { //if there is user session data
      this.setState({userName: userN}); //retrieve data and set state accordingly
      let userT = sessionStorage.getItem("userType");
      if (userT) this.setState({userType: userT});
    }
  }

  setUserName = (userN) => {  //function to set user context data (user name)
    this.setState({userName: userN});
  } 

  setUserType = (userT) => {  //function to set user context data (user type)
    this.setState({userType: userT});
  }

  render(){
  return <div className='App'>
      <Router>
        <MainContext.Provider value={{userName: this.state.userName, userType: this.state.userType, setUserName: this.setUserName, setUserType: this.setUserType}}>
          <MainContext.Consumer>
            {(value)=>{
              return (
                  <Switch>
                    <Route path='/login'  render={(props) => (<Login {...props} context={value}/>)}></Route>
                    <Route path='/studentHome' render={(props) => (<StudentHome {...props} context={value}/>)}></Route>
                    <Route path='/teacherHome' render={(props) => (<TeacherHome {...props} context={value}/>)}></Route>
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