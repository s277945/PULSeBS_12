 import React, { Component } from 'react'
 import Nav from 'react-bootstrap/Nav'
 import Navbar from 'react-bootstrap/Navbar'
 import { authContext } from '../components/Authsystem'
 import { withRouter } from 'react-router-dom';


class TeacherNavbar extends Component {
    static contextType = authContext

     showLectures = () => { //function called when Lectures link is selected
         this.props.setShow(0);
     }

     showStudentList = () =>{
         this.props.setShow(1)
     }

     redirHome = (e) => { //function that redirects to the home page
         e.preventDefault();
         this.props.history.push("/");
     }

     handleLogout = () => {
        this.context.signout().then(() => {
            this.props.history.replace("/")
        })
     }

     render() {

         return (
             <>
                 <Navbar bg="dark" variant="dark">
                     <Navbar.Brand href="#" onClick={this.redirHome}>PULSeBS</Navbar.Brand>
                     <Nav className="mr-auto">
                         <Nav.Link href="#lectures" onSelect={this.showLectures}>Lectures</Nav.Link>
                         <Nav.Link data-testid="teacherStudent" href="#studentList" onSelect={this.showStudentList}>Student List</Nav.Link>
                     </Nav>
                     <Nav.Link data-testid="logout" href="#logout" onSelect={this.handleLogout}>Logout</Nav.Link>
                 </Navbar>
             </>
         )
     }
 }

 export default withRouter(TeacherNavbar)
