import React, { Component, useContext } from 'react'
import StudentNavbar from './studentNavbar'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { authContext } from '../components/Authsystem'
import { getLectures, getCourses, getStudentBookedLectures, getStudentWaitingLectures, postStudentBookedLecture, deleteStudentBookedLecture } from '../api/api'
import Calendar from '../components/Calendar';
import Container from 'react-bootstrap/Container'
import moment from 'moment'
import StudentHomeTour from "../components/StudentHomeTourSystem";
import {TourContext, getTourState} from "../components/StudentHomeTourSystem";

class StudentHome extends Component {
    static contextType = authContext

    constructor(props){
        super(props)

        this.state = {
            show : 0, //This state variable is used to choose the content to show. (0 : table, 1: calendar)
            courses: [],
            lectures: [],
            togglecourse: null,
            modal: {show: 0, lecture: null, message: null}, //this object contains all modal state variables
            popup: {show: 0, lecture: {Name: "", Date: ""}, message: null}// this object contains all popup related variables
        }

        if(props.tour.isTourOpen) this.state = getTourState()
    }

    componentDidMount() {
        // Don't fetch nor save data when doing the tour
        if(this.props.tour.isTourOpen) return;

        this.getLecturesAndCoursesData();
        this.handleSessionStorage();
    }

    componentDidUpdate(prevProps){
        if(!this.props.tour.isTourOpen && prevProps.tour.isTourOpen){
            this.getLecturesAndCoursesData();
            this.handleSessionStorage();
        }

        if(this.props.tour.isTourOpen && !prevProps.tour.isTourOpen){
            this.setState(getTourState())
        }
    }

    getLecturesAndCoursesData(){
        // Get students courses data
        getCourses().then(response => {
            this.setState({ courses: response.data })
        })
        .catch(/* istanbul ignore next */err => {
            console.error(err);
        })
        getLectures().then(response => {
            this.setState({ lectures: response.data })
            this.setBookedLectures();
            this.setWaitingLectures();
        })
        .catch(/* istanbul ignore next */err => {
            console.error(err);
        })
    }

    handleSessionStorage(){
        let pagestate = sessionStorage.getItem("pagestate");//get saved show state value
        let togglecourse = sessionStorage.getItem("togglecourse");//get saved accordion state value
        let modal = sessionStorage.getItem("modal");//get saved modal state value
        let popup = sessionStorage.getItem("popup");//get saved popup state value
        let redir = sessionStorage.getItem("redir");//get saved redir value
        if(pagestate!==null) this.setState({ show : parseInt(pagestate, 10) });
        else sessionStorage.setItem("pagestate", 0);//if none is present, save show state value
        if(modal!==null && pagestate==="0") this.setState({ modal: JSON.parse(modal) });
        else sessionStorage.setItem("modal", JSON.stringify(this.state.modal));//if none is present, save modal state value
        if(popup!==null && pagestate==="0") this.setState({ popup: JSON.parse(popup) });
        else sessionStorage.setItem("popup", JSON.stringify(this.state.popup));//if none is present, save popup state value
        if(togglecourse!==null && pagestate==="0") this.setState({ togglecourse: togglecourse });
        else sessionStorage.setItem("togglecourse", this.state.togglecourse);//if none is present, save modal state value
        if(redir===null) sessionStorage.setItem("redir", this.context.user.userName);//if none is present, set new redir value
    }

    setShow = (val) => { //Function to set the show variable
        this.setState({show : val});
    }

    modalClose = () => {
        let newmodal = this.state.modal;
        newmodal.show=0;
        this.setState({ modal: newmodal });
        sessionStorage.removeItem("modal");
    }

 /*   modalShow = () => {
        let newmodal = this.state.modal;
        newmodal.show=1;
        this.setState({ modal: newmodal });
    }*/

    setBookedLectures(){
        // Go through all lectures, if its a booked one, put alreadyBooked to true
        let newLectureArray;
        getStudentBookedLectures().then((reponse) => {
            newLectureArray = this.state.lectures.slice()
            reponse.data.map(bookedLecture => {
                const index = this.state.lectures.findIndex(lecture =>
                    lecture.Course_Ref === bookedLecture.Course_Ref && lecture.Date === bookedLecture.Date_Ref
                )
                /* istanbul ignore else */
                if(index!==-1)newLectureArray[index].alreadyBooked = true;
                return index;
            })
            this.setState({lectures: newLectureArray})
        }).catch(/* istanbul ignore next */err=>{
            console.error(err);
         });

    }

    setWaitingLectures(){
        // Go through all lectures, if its one where the student is in waiting list, put alreadyWaiting to true
        let newLectureArray;
        getStudentWaitingLectures().then((reponse) => {
            newLectureArray = this.state.lectures.slice()
            reponse.data.map(waitingLecture => {
                const index = this.state.lectures.findIndex(lecture =>
                    lecture.Course_Ref === waitingLecture.Course_Ref && lecture.Date === waitingLecture.Date_Ref
                )
                newLectureArray[index].alreadyWaiting = true;
                return index;
            })
            this.setState({lectures: newLectureArray})
        }).catch(/* istanbul ignore next */err=>{
            console.error(err);
         });

    }

    /*
    * Query parameters: userID(from session), lectureId, date
    * Body response: status 201/404/500
    * Button that POST a request to book a seat for the session user
    */
    bookASeat(lectureId, date, endDate){
        const body = {
            lectureId: lectureId,
            date: date,
            endDate: endDate
        }
        postStudentBookedLecture(body)
            .then(response => {
                
                const newLectures = this.state.lectures.slice();
                const index = this.state.lectures.findIndex(lecture => //get lecture index in state array
                    lecture.Course_Ref === lectureId && lecture.Date === date
                )
                if(response.data.operation==="booked") {
                    newLectures[index].BookedSeats++;// increase booked seats number if successful booking
                    /* istanbul ignore else */
                    if(newLectures[index].BookedSeats>newLectures[index].Capacity) newLectures[index].BookedSeats=newLectures[index].Capacity; //check booking number constraint
                    newLectures[index].alreadyBooked = true// set booking state to true
                }
                else {
                    newLectures[index].BookedSeats=newLectures[index].Capacity;// otherwise all capacity is used
                    newLectures[index].alreadyWaiting = true// set waiting list state to true
                }
                this.setState({lectures: newLectures})
                this.modalClose();// then close modal
            }).catch(err=>{
                console.error(err);
                if (err.response.status===500) {
                    /* istanbul ignore else */
                    if (err.response.data.errors[0].msg==="0 seats available") this.setPopup("Your booking request was not successful: there are no more seats available for this lecture");
                    else this.setPopup("Your booking request was not successful: server error");
                    this.modalClose();// then close modal
                }
             });
    }

    cancelSeat(lectureId, date){
        deleteStudentBookedLecture(lectureId, date)
            .then(response => {
                const newLectures = this.state.lectures.slice();
                const index = this.state.lectures.findIndex(lecture => //get lecture index in state array
                    lecture.Course_Ref === lectureId && lecture.Date === date
                )
                /* istanbul ignore else */
                if(newLectures[index].alreadyBooked) {//check if student was booked
                    newLectures[index].alreadyBooked = false// set booking requested state to false
                    newLectures[index].BookedSeats--;// decrease booked seats number if successful canceling
                }
                else newLectures[index].alreadyWaiting=false;// set waiting list state to false                
                this.setState({lectures: newLectures})
                this.modalClose();// then close modal
            }).catch(/* istanbul ignore next */err=>{
                console.error(err);
             });
    }

    renderBookASeatButton(lecture, index, disabled){
        return(
            <>
            {(lecture.alreadyBooked || disabled)  &&
                <Button disabled>Book Seat</Button>
            }
            {(!lecture.alreadyBooked && !lecture.alreadyWaiting && !disabled) && lecture.BookedSeats<lecture.Capacity &&
                <Button data-testid={'bookButton_'+index} onClick={() => this.setModal(lecture, "book a seat")}>Book Seat</Button>
            }
            {lecture.alreadyWaiting && !lecture.alreadyBooked &&
                <Button variant="warning" disabled>In waiting list</Button>
            }
            {(!lecture.alreadyBooked && !lecture.alreadyWaiting && !disabled) && lecture.BookedSeats>=lecture.Capacity &&
                <Button variant="warning" data-testid={'waitButton_'+index} onClick={() => this.setModal(lecture, "enter the waiting list")}>Enter waiting list</Button>
            }
            </>
        )
    }

    renderCancelButton(lecture, index, disabled){
        return (
            <>
            {(lecture.alreadyBooked && !disabled) &&
                <Button data-testid={'cancelButton_'+index} onClick={() => this.setModal(lecture, "cancel your booking")} variant="danger">Cancel</Button>
            }
            {(lecture.alreadyWaiting) && !lecture.alreadyBooked &&
                <Button disabled data-testid={'cancelButton_'+index} onClick={() => this.setModal(lecture, "cancel your reservation")} variant="danger">Cancel</Button>
            }
            {((!lecture.alreadyBooked && !lecture.alreadyWaiting) || disabled) &&
                <Button variant="danger" disabled>Cancel</Button>
            }
            </>
        )
    }

    setModal(lecture, message) {// set modal state variables to passed values and show modal
        let newmodal = {show: 1, lecture: lecture, message: message};
        this.setState({ modal: newmodal });
        sessionStorage.setItem("modal", JSON.stringify(newmodal));
    }

    renderModal() {
        let confirm = () => {// function called when "yes button is pressed"
            if(this.state.modal.message==="cancel your booking") this.cancelSeat(this.state.modal.lecture.Course_Ref, this.state.modal.lecture.Date);// depending on operation, call cancel or book function
            else this.bookASeat(this.state.modal.lecture.Course_Ref, this.state.modal.lecture.Date, this.state.modal.lecture.EndDate);
        }
        let renderColor = () => {
            switch (this.state.modal.message) {
                case "book a seat":
                    return "primary";

                case "cancel your reservation":
                    return "warning";
    
                case "enter the waiting list":
                    return "warning";
    
                case "cancel your booking": 
                    return "danger";
    
                default:
                    return "secondary";
            }
        }
        return (
            <Modal show={this.state.modal.show===1? true:false} onHide={this.modalClose} style={{marginTop: "25vh"}}>
                <Modal.Header class="app-element-background" closeButton style={{minWidth: "498px"}}>
                    <div  style={{flexWrap: "wrap", justifyContent: "center", minWidth: "432px"}}>
                        <p style={{paddingTop: "15px", paddingBottom: "30px", fontSize: "25px", textAlign: "center"}}>Do you want to {this.state.modal.message} for this lecture?</p>
                        <div style={{display: "flex", flexWrap: "nowrap",  justifyContent: "space-around", paddingTop: "7px", paddingBottom: "7px"}}>
                            <div style={{marginLeft: "37px"}}>
                                <Button onClick={() => confirm()} variant={renderColor()} style={{ marginRight: "27px", paddingRight: "17px", paddingLeft: "17px"}}>Yes</Button>
                                <Button onClick={this.modalClose} variant="secondary" style={{ paddingRight: "17px", paddingLeft: "17px"}}>No</Button>
                            </div>
                        </div>
                    </div>
                </Modal.Header>
            </Modal>
        )
    }

    popupClose = () => {// close popup
        this.setState({ popup: {show: 0, lecture: {Name: "", Date: ""}, message: null} });
        sessionStorage.removeItem("popup");
    }

    setPopup(message) {// set up popup state variables, hide modal, show popup, handle session data
        let lecture = this.state.modal.lecture;
        let newpopup = {show: 1, lecture: lecture, message: message};
        this.setState({ modal: {show: 0, lecture: null, message: null}, popup: newpopup });
        sessionStorage.setItem("popup", JSON.stringify(newpopup));
        sessionStorage.removeItem("modal");
    }

    renderPopup() {
        return(
            <Modal data-testid={"popup_student"} show={this.state.popup.show===1? true:false} onHide={this.popupClose} style={{marginTop: "25vh"}}>
                <Modal.Header class="app-element-background" closeButton style={{minWidth: "498px"}}>
                    <div  style={{flexWrap: "wrap", justifyContent: "center", minWidth: "432px", marginTop: "10px"}}>
                        <div><p style={{fontSize: "25px", fontWeight:'bold', display: "inline", marginLeft: "27px"}}>Lecture:  </p><p style={{display: "inline", fontSize: "25px", marginLeft: "10px"}}>{this.state.popup.lecture.Name}</p></div>
                        <div><p style={{fontSize: "25px", fontWeight:'bold', display: "inline", marginLeft: "27px"}}>Date: </p><p style={{display: "inline", fontSize: "25px", marginLeft: "10px"}}>{this.state.popup.lecture.Date}</p></div>
                        <br></br>
                        <div><p style={{paddingTop: "15px", paddingBottom: "30px", fontSize: "23px", textAlign: "center", marginLeft: "23px"}}>{this.state.popup.message}</p></div>
                        <div style={{display: "flex", flexWrap: "nowrap",  justifyContent: "space-around", paddingTop: "7px", paddingBottom: "7px"}}>
                            <div style={{marginLeft: "37px"}}>
                                <Button onClick={this.popupClose} variant="secondary" style={{ paddingRight: "17px", paddingLeft: "17px"}}>Close</Button>
                            </div>
                        </div>
                    </div>
                </Modal.Header>
            </Modal>
        )

    }

    renderLectureTables(){
        return (
            <div>
                <h4 className="page-subtitle-2">Select by course</h4>
                <Accordion activeKey={this.state.togglecourse}>
                    {this.state.courses.map(course =>
                        <Card tour-selec="course-card" key={course.Name}>
                            <Accordion.Toggle as={Card.Header}  eventKey={course.Name} onClick={(e)=> {// set accordion selection state
                                e.preventDefault();
                                /* istanbul ignore if */
                                if (this.state.togglecourse===e.target.innerText) {
                                    this.setState({togglecourse: null});// if already open close
                                    sessionStorage.removeItem("togglecourse");// remove accordion session data
                                }
                                else {
                                    this.setState({togglecourse: e.target.innerText});// else open
                                    sessionStorage.setItem("togglecourse", e.target.innerText);// save accordion session data
                                }
                                }}>
                            {course.Name}
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey={course.Name}>
                                <Card.Body>
                                    <Table  data-testid={'lectures'} striped bordered hover style={{ backgroundColor: "#fff" }}>
                                        <thead>
                                            <tr>
                                                <th>Lecture</th>
                                                <th>Time and date</th>
                                                <th>Booking deadline</th>
                                                <th>Booked seats</th>
                                                <th>Total capacity</th>
                                                <th>Lecture type</th>
                                                <th>Lecture Booking</th>
                                                <th>Cancel booking</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.lectures.filter(lecture=>lecture.Course_Ref===course.CourseID).map((lecture, index) =>
                                                <tr key={lecture.Name}>
                                                    <td>{lecture.Name}</td>
                                                    <td>{moment(lecture.Date).format('YYYY-MM-DD HH:mm')}</td>
                                    <td>{moment(lecture.DateDeadline).format('YYYY-MM-DD HH:mm')}</td>
                                                    <td>{lecture.Type === 'p' ? lecture.BookedSeats : "/"}</td>
                                                    <td>{lecture.Type === 'p' ? lecture.Capacity : "/"}</td>
                                                    <td>{lecture.Type === 'p' ? "Presence" : "Virtual Classroom"}</td>
                                                    <td>{lecture.Type === 'p'&&moment().isBefore(lecture.DateDeadline)? this.renderBookASeatButton(lecture, index, false) : this.renderBookASeatButton(lecture, index, true)}</td>
                                                    <td>{lecture.Type === 'p'&&moment().isBefore(lecture.DateDeadline)? this.renderCancelButton(lecture, index, false) : this.renderCancelButton(lecture, index, true)}</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    )}
               </Accordion>
            </div>
        )
    }

    renderTodayLectureTables(){
        return (

            <div tour-selec="today-lecture">
                <br/>
                <h3 className="page-subtitle-1">Today</h3>
                <br/>
                <Table data-testid={'lectures'} striped bordered hover style={{backgroundColor: "#fff", width:"98.5%", margin: "auto", marginBottom: "34px"}}>
                    <thead>
                    <tr>
                        <th>Lecture</th>
                        <th>Time and date</th>
                        <th>Booking deadline</th>
                        <th>Booked seats</th>
                        <th>Total capacity</th>
                        <th>Lecture type</th>
                        <th>Lecture Booking</th>
                        <th>Cancel booking</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.lectures.filter(lecture=>moment(lecture.Date).isSame(moment(), 'day')).map((lecture,index) =>
                        <tr key={index}>
                            <td>{lecture.Name}</td>
                            <td>{moment(lecture.Date).format('YYYY-MM-DD HH:mm')}</td>
                            <td>{moment(lecture.DateDeadline).format('YYYY-MM-DD HH:mm')}</td>
                            <td>{lecture.Type==='p'?lecture.BookedSeats:"/"}</td>
                            <td>{lecture.Type==='p'?lecture.Capacity:"/"}</td>
                            <td>{lecture.Type==='p'?"Presence":"Virtual Classroom"}</td>
                            <td>{lecture.Type==='p'&&moment().isBefore(lecture.DateDeadline)?this.renderBookASeatButton(lecture, index, false):this.renderBookASeatButton(lecture, index, true)}</td>
                            <td>{lecture.Type==='p'&&moment().isBefore(lecture.DateDeadline)?this.renderCancelButton(lecture, index, false):this.renderCancelButton(lecture, index, true)}</td>
                        </tr>
                    )}
                    </tbody>
                </Table>
            </div>
        )
    }

    renderCalendar(){
        return(
            <div>
                <br/>
                <h1 className="page-title">Calendar</h1>
                <Container className="mt-5">
                    <div style={{borderStyle: "solid", borderRadius: "6px", borderWidth: "1px", borderColor: "rgb(235, 235, 235)", padding: "17px", backgroundColor: "white"}}>
                        <Calendar lectures={this.state.lectures} courses={this.state.courses}></Calendar>
                    </div>
                </Container>
                <br/>
            </div>
        )
    }
    /* istanbul ignore next */
    renderContent = () => {
        if(!this.state.lectures){
            return(
                <p>Loading.....</p>
            )
        }

        if (this.state.show === 0) return ( <>
                                                <br/>
                                                <h1 className="page-title">Lectures</h1>
                                                <br/>{this.renderTodayLectureTables()}{this.renderLectureTables()}
                                            </>);
        /* istanbul ignore else */
        if(this.state.show === 1) return(this.renderCalendar())
    }



    render() {
        return (
            <div className="app-element-background">
                
                <StudentNavbar setShow={this.setShow}/>
                {this.renderContent()}
                {this.renderModal()}
                {this.renderPopup()}
            </div>
        )
    }
}

// Using wrapper to pass context as props (bcs a react component can only have one static context, and StudentHome is already the one for auth)
// Note : could me more elegant with hooks, bcs refactoring now looks tedious
const TourContextWrapper = () => {
    return(
        <StudentHomeTour>
            <TourContext.Consumer>{tour=>
                <StudentHome tour={tour}/>
            }              
            </TourContext.Consumer>
        </StudentHomeTour>
    )
}
export default TourContextWrapper