import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Login from './pages/Login'
import { StudentHome } from './pages/studentHome'
import { TeacherHome } from './pages/teacherHome'
import BookingManagerHome from './pages/BookingManagerHome'
import {PrivateRoute, ProvideAuth} from './components/Authsystem';


class App extends Component {
  componentDidMount(){
    document.title = "PULSeBS"
  }

  render(){
    return(
      <ProvideAuth>
        <Router>
          <Switch>
            <Route exact path='/'>
              <Login />
            </Route>
            <PrivateRoute path='/studentHome' userType='s'>
              <StudentHome />
            </PrivateRoute>
            <PrivateRoute path='/teacherHome' userType='t'>
              <TeacherHome />
            </PrivateRoute>
            {/**TODO : change to privateRoute */}
            <Route path='/bookingHome' userType='b'>
              <BookingManagerHome />
            </Route>
          </Switch>
        </Router>
      </ProvideAuth>
    )
  }
}

export default App;