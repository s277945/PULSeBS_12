import React, { Component } from 'react'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { authContext } from '../components/Authsystem'
import { withRouter } from 'react-router-dom';
import Button from 'react-bootstrap/Button'

class StudentNavbar extends Component {
    static contextType = authContext
    state = {
                lectureslink: true,
                calendarlink: false
            }

    componentDidMount() {
        let pagestate = parseInt(sessionStorage.getItem("pagestate"), 10);//get saved state value
        if(pagestate===1) this.setState({ lectureslink: false,calendarlink: true });
        this.props.tour.setStepsNum(pagestate)
    }
    showLectures = () => { //Function called when Lectures link is selected
        this.props.setShow(0);
        this.props.tour.setStepsNum(0)
        sessionStorage.setItem("pagestate", 0);//save state value
        this.setState({lectureslink: true,calendarlink: false});
    }

    redirHome = (e) => { //Function that redirects to the home page
        e.preventDefault();
        this.props.setShow(0);
        this.props.tour.setStepsNum(0)
        
        sessionStorage.setItem("pagestate", 0);//save state value
        this.setState({lectureslink: true,calendarlink: false});
        this.props.history.push("/studentHome");
    }

    showCalendar = () => { //Function called when Calendar link is selected
        this.props.setShow(1);
        this.props.tour.setStepsNum(1)

        sessionStorage.setItem("pagestate", 1);//save state value
        this.setState({lectureslink: false,calendarlink: true});
    }

    handleLogout = () => {
        this.context.signout().then(() => {
            this.props.history.replace("/")
        })
    }
    render() {

        return (
            <>
                <Navbar bg="dark" variant="dark" >
                    <Navbar.Brand data-testid={'home'} href="#" onClick={this.redirHome}>PULSeBS</Navbar.Brand>
                    <Nav tour-selec="navbar" className="mr-auto">
                        <Nav.Link data-testid={"studentLectures"} href="#lectures" active={this.state.lectureslink} onSelect={this.showLectures}>Lectures</Nav.Link>
                        <Nav.Link data-testid={"calendar"} href="#calendar" active={this.state.calendarlink} onSelect={this.showCalendar}>Calendar</Nav.Link>
                    </Nav>

                    <Button data-testid={"tour"} variant="dark" onClick={() => {this.props.tour.setIsTourOpen(true); localStorage.setItem("willingNewTutorial", true)}}>Help</Button>

                    <Nav.Link data-testid="logout" href="#logout" onSelect={this.handleLogout}>Logout</Nav.Link>
                </Navbar>
            </>
        )
    }
}

export default withRouter(StudentNavbar)
