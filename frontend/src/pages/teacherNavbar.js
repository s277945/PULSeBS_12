// import React, { Component } from 'react'
// import Nav from 'react-bootstrap/Nav'
// import Navbar from 'react-bootstrap/Navbar'
// import handleLogout from './handleLogout.js'

// export class TeacherNavbar extends Component {

//     showLectures = () => { //function called when Lectures link is selected
//         this.props.setShow(0);
//     }

//     showStudentList = () =>{
//         this.props.setShow(1)
//     }

//     redirHome = (e) => { //function that redirects to the home page
//         e.preventDefault();
//         this.props.history.push("/");
//     }

//     handleLogout = () => {
//         handleLogout.handleLogout(this.props.context, this.props.history)
//     }

//     render() {

//         return (
//             <>
//                 <Navbar bg="dark" variant="dark">
//                     <Navbar.Brand href="#" onClick={this.redirHome}>PULSeBS</Navbar.Brand>
//                     <Nav className="mr-auto">
//                         <Nav.Link href="#lectures" onSelect={this.showLectures}>Lectures</Nav.Link> 
//                         <Nav.Link href="#studentList" onSelect={this.showStudentList}>Student List</Nav.Link>                     
//                     </Nav>
//                     <Nav.Link href="#logout" onSelect={this.handleLogout}>Logout</Nav.Link>
//                 </Navbar>
//             </>
//         )
//     }
// }