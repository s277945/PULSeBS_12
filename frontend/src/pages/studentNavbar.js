import React, { Component } from 'react'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import userIdentity from '../api/userIdentity.js'

export class StudentNavbar extends Component { 
    showLectures = () => {
        this.props.setShow(0);
    }

    redirHome = (e) => {
        e.preventDefault();
        this.props.history.push("/");
    }

    showCalendar = () => {
        this.props.setShow(1);
    }

    handleLogout = () => {
        userIdentity.removeUserSession(this.props.context);
        this.props.history.push("/");
    }

    render() {

        return (
            <>
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand href="#" onClick={this.redirHome}>PULSeBS</Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link href="#lectures" onSelect={this.showLectures}>Lectures</Nav.Link>
                        <Nav.Link href="#calendar" onSelect={this.showCalendar}>Calendar</Nav.Link>                        
                    </Nav>
                    <Nav.Link href="#logout" onSelect={this.handleLogout}>Logout</Nav.Link>
                </Navbar>
            </>
        )
    }
}