import React, { Component } from 'react'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import userIdentity from '../api/userIdentity.js'

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
        //axios.post("http://localhost:3001/api/logout"); //close user session
        fetch ('http://localhost:3001/api/logout', {// send post request, will delete cookie jwt token
            method: 'post',
            credentials: 'include'
        }).then((r) => {
            if (r.status === 200) {// check response status
                console.log("Logout successful " + r.status);
            }
            else console.log("Logout error " + r.status);
        }).catch(err=>{console.log(err)});
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