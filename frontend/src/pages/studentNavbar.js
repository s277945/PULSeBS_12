import React, { Component } from 'react'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'

export class StudentNavbar extends Component { 
    showLectures = (e) => {
        e.preventDefault();
        this.props.setShow(0);
    }

    redirHome = (e) => {
        e.preventDefault();
        this.props.history.push("/");
    }

    redirCalendar = (e) => {
        e.preventDefault();
    }

    render() {

        return (
            <>
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand href="#home">PULSeBS</Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link href="#lectures">Lectures</Nav.Link>
                        <Nav.Link href="#calendar">Calendar</Nav.Link>
                    </Nav>
                </Navbar>
            </>
        )
    }
}