 import React, { Component } from 'react'
 import Nav from 'react-bootstrap/Nav'
 import Navbar from 'react-bootstrap/Navbar'
 import { authContext } from '../components/Authsystem'
 import { withRouter } from 'react-router-dom';
 

class TeacherNavbar extends Component {
    static contextType = authContext
    state = { 
        lectureslink: false,
        studentslink: false
    }
     showLectures = () => { //function called when Lectures link is selected
         this.props.setShow(0);
         this.setState({ lectureslink: true,studentslink: false});
     }

     showStudentList = () =>{
         this.props.setShow(1)
         this.setState({ lectureslink: false,studentslink: true});
     }

     redirHome = (e) => { //function that redirects to the home page
         e.preventDefault();
         this.props.setShow(0);
         this.setState({ lectureslink: false,studentslink: false});
         this.props.history.push("/teacherHome");
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
                         <Nav.Link href="#lectures" active={this.state.lectureslink} onSelect={this.showLectures}>Lectures</Nav.Link> 
                         <Nav.Link href="#studentList" active={this.state.studentslink} onSelect={this.showStudentList}>Student List</Nav.Link>                     
                     </Nav>
                     <Nav.Link href="#logout" onSelect={this.handleLogout}>Logout</Nav.Link>
                 </Navbar>
             </>
         )
     }
 }

 export default withRouter(TeacherNavbar)