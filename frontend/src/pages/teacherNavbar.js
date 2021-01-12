import React, { Component } from 'react'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { authContext } from '../components/Authsystem'
import { withRouter } from 'react-router-dom';

import { TeacherHistTourContext, TeacherLecTourContext, TeacherSLTourContext } from "../components/TeacherTours";
import Button from 'react-bootstrap/Button'


class TeacherNavbar extends Component {
    static contextType = authContext
    state = {
        lectureslink: true,
        studentslink: false,
        historylink: false
    }
    componentDidMount() {
        let pagestate = parseInt(sessionStorage.getItem("pagestate"), 10);//get saved state value
        if (pagestate === 1) this.setState({ lectureslink: false, studentslink: true, historylink: false });
        else if (pagestate === 2) this.setState({ lectureslink: false, studentslink: false, historylink: true });
    }
    showLectures = () => { //function called when Lectures link is selected
        this.props.setShow(0);
        sessionStorage.clear();
        sessionStorage.setItem("pagestate", 0);//save state value
        this.setState({ lectureslink: true, studentslink: false, historylink: false });
    }

    showStudentList = () => {
        this.props.setShow(1)
        sessionStorage.clear();
        sessionStorage.setItem("pagestate", 1);//save state value
        this.setState({ lectureslink: false, studentslink: true, historylink: false });
    }

    showHistory = () => {
        this.props.setShow(2)
        sessionStorage.clear();
        sessionStorage.setItem("pagestate", 2);//save state value
        this.setState({ lectureslink: false, studentslink: false, historylink: true });
    }

    redirHome = (e) => { //function that redirects to the home page
        e.preventDefault();
        this.props.setShow(0);
        sessionStorage.setItem("pagestate", 0);//save state value
        this.setState({ lectureslink: true, studentslink: false, historylink: false });
        this.props.history.push("/teacherHome");
    }

    handleLogout = () => {
        this.context.signout().then(() => {
            this.props.history.replace("/")
        })
    }

    renderTourButton = () => {

        switch (this.props.show) {
            case 0:
                return <TeacherLecTourContext.Consumer>
                    {tour => <Button data-testid={"tour"} variant="dark" onClick={() => {tour.setIsTourOpen(true); localStorage.setItem("willingNewTutorial", true)}}>Help</Button>}
                </TeacherLecTourContext.Consumer>
            case 1:
                return <TeacherSLTourContext.Consumer>
                    {tour => <Button data-testid={"tour"} variant="dark" onClick={() => {tour.setIsTourOpen(true); localStorage.setItem("willingNewTutorial", true)}}>Help</Button>}
                </TeacherSLTourContext.Consumer>
            case 2:
                return <TeacherHistTourContext.Consumer>
                    {tour => <Button data-testid={"tour"} variant="dark" onClick={() => {tour.setIsTourOpen(true); localStorage.setItem("willingNewTutorial", true)}}>Help</Button>}
                </TeacherHistTourContext.Consumer>
            default:
            // code block
        }

    }

    render() {

        return (
            <>
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand data-testid={"homeRedirect"} href="#" onClick={this.redirHome}>PULSeBS</Navbar.Brand>
                    <Nav tour-selec="TeachNavBar" className="mr-auto">   
                        <TeacherLecTourContext.Consumer>
                            {tour => <Nav.Link data-testid={"lecturesPage"} href="#lectures" active={this.state.lectureslink} onSelect={()=>{this.showLectures(); tour.setIsTourOpen(true)}}>Lectures</Nav.Link>}
                        </TeacherLecTourContext.Consumer>
                        <TeacherSLTourContext.Consumer>
                            {tour => <Nav.Link data-testid="teacherStudent" href="#studentList" active={this.state.studentslink} onSelect={()=>{this.showStudentList(); tour.setIsTourOpen(true)}}>Student List</Nav.Link>}
                        </TeacherSLTourContext.Consumer>
                        <TeacherHistTourContext.Consumer>
                            {tour => <Nav.Link data-testid="history" href="#history" active={this.state.historylink} onSelect={()=>{this.showHistory(); tour.setIsTourOpen(true)}}>Historical Data</Nav.Link>}
                         </TeacherHistTourContext.Consumer>
                            
                    </Nav>
                    {this.renderTourButton()}


                    <Nav.Link data-testid="logout" href="#logout" onSelect={this.handleLogout}>Logout</Nav.Link>
                </Navbar>
            </>
        )
    }
}

export default withRouter(TeacherNavbar)
