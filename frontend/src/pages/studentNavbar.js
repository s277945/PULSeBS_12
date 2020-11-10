import React, { Component } from 'react'
import { browserHistory } from 'react-router';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

export class studentNavbar extends Component { 
    showLectures = (e) => {
        e.preventDefault();
        this.props.setShowLectures(true);
    }

    redirHome = (e) => {
        e.preventDefault();
        //browserHistory.push("/");
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