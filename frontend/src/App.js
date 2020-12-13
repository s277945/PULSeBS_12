import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Login from './pages/Login'
import { StudentHome } from './pages/studentHome'
import { TeacherHome } from './pages/teacherHome'
import BookingManagerHome from './pages/BookingManagerHome'
import {PrivateRoute, ProvideAuth} from './components/Authsystem'
import SupportOfficerHome from './pages/SupportOfficerHome'


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
            <PrivateRoute path='/bookingHome' userType='bm'>
              <BookingManagerHome />
            </PrivateRoute>
            <PrivateRoute path='/supportOfficer' userType='so'>
              <SupportOfficerHome />
            </PrivateRoute>
          </Switch>
        </Router>
      </ProvideAuth>
    )
  }
}

export default App;