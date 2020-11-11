import React, { Component } from 'react'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import userIdentity from '../api/userIdentity.js'
import axios from 'axios'

export class TeacherNavbar extends Component { 
    showLectures = () => { //function called when Lectures link is selected
        this.props.setShow(0);
    }

    redirHome = (e) => { //function that redirects to the home page
        e.preventDefault();
        this.props.history.push("/");
    }

    handleLogout = () => { //function to logout the user
        userIdentity.removeUserSession(this.props.context); //clear user session data
        axios.post("http://localhost:3001/api/logout"); //close user session
        this.props.history.push("/"); //redirect to login page
    }

    render() {

        return (
            <>
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand href="#" onClick={this.redirHome}>PULSeBS</Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link href="#lectures" onSelect={this.showLectures}>Lectures</Nav.Link>                     
                    </Nav>
                    <Nav.Link href="#logout" onSelect={this.handleLogout}>Logout</Nav.Link>
                </Navbar>
            </>
        )
    }
}