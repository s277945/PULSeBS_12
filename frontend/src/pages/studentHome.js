import React, { Component } from 'react'
import StudentNavbar from './studentNavbar'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { authContext } from '../components/Authsystem'
import { getLectures, getStudentBookedLectures, postStudentBookedLecture, deleteStudentBookedLecture } from '../api/api'

export class StudentHome extends Component {
    static contextType = authContext

    state = {
        show : 0, //This state variable is used to choose the content to show
        lectures: null,
        modal: {show: 0, lecture: null, index: null, message: null} //this object contains all modal state variables
    }
    componentDidMount() {
        // Get students lectures
        getLectures().then(response => {
            this.setState({ lectures: response.data })
            this.setBookedLectures();
        })
        .catch(err => {
            console.log(err);
        })
        let pagestate = sessionStorage.getItem("pagestate");//get saved show state value
        let modal = sessionStorage.getItem("modal");//get saved modal state value
        let redir = sessionStorage.getItem("redir");//get saved redir value
        if(pagestate!==null) this.setState({ show : parseInt(pagestate, 10) });
        else sessionStorage.setItem("pagestate", 0);//if none is present, save show state value
        if(modal!==null && pagestate==="0") this.setState({ modal: JSON.parse(modal) });
        else sessionStorage.setItem("modal", JSON.stringify(this.state.modal));//if none is present, save modal state value
        if(redir===null) sessionStorage.setItem("redir", this.context.user.userName);//if none is present, set new redir value
    }

    setShow = (val) => { //Function to set the show variable
        this.setState({show : val});
    }

    modalClose = () => {
        let newmodal = this.state.modal;
        newmodal.show=0;
        this.setState({ modal: newmodal });
    }

    modalShow = () => {
        let newmodal = this.state.modal;
        newmodal.show=1;
        this.setState({ modal: newmodal });
    }

    setBookedLectures(){
        // Go through all lectures, if its a booked one, put alreadyBooked to true
        let newLectureArray;
        getStudentBookedLectures().then((reponse) => {
            newLectureArray = this.state.lectures.slice()
            reponse.data.map(bookedLecture => {
                const index = this.state.lectures.findIndex(lecture =>
                    lecture.Course_Ref === bookedLecture.Course_Ref && lecture.Date === bookedLecture.Date_Ref
                )
                newLectureArray[index].alreadyBooked = true;
                return index;
            })
            this.setState({lectures: newLectureArray})
        }).catch(err=>{ 
            console.log(err);
         });
                
    }

    /*
    * Query parameters: userID(from session), lectureId, date
    * Body response: status 201/404/500
    * Button that POST a request to book a seat for the session user
    */
    bookASeat(lectureId, date, index){
        const body = {
            lectureId: lectureId,
            date: date
        }
        postStudentBookedLecture(body)
            .then(response => {
                const newLectures = this.state.lectures.slice();
                newLectures[index].alreadyBooked = true
                this.setState({lectures: newLectures})
            }).catch(err=>{ 
                console.log(err);
             });
    }

    cancelSeat(lectureId, date, index){
        deleteStudentBookedLecture(lectureId, date)
            .then(response => {
                console.log(response)
                const newLectures = this.state.lectures.slice();
                newLectures[index].alreadyBooked = false
                this.setState({lectures: newLectures})
            }).catch(err=>{ 
                console.log(err);
             });
    }

    renderBookASeatButton(lecture, index){
        return(
            <>
            {lecture.alreadyBooked &&
                <Button disabled>Book Seat</Button>
            }
            {!lecture.alreadyBooked &&
                <Button onClick={() => this.setModal(lecture, index, "book a seat")}>Book Seat</Button>
            }
            </>
        )
    }

    renderCancelButton(lecture, index){
        return (
            <>
            {lecture.alreadyBooked && 
                <Button onClick={() => this.setModal(lecture, index, "cancel your booking")} variant="danger">Cancel</Button>
            }
            {!lecture.alreadyBooked && 
                <Button variant="danger" disabled>Cancel</Button>
            }
            </>
        )
    }

    setModal(lecture, index, message) {// set modal state variables to passed values and show modal
        let newmodal = {show: 1, lecture: lecture, index: index, message: message};
        this.setState({ modal: newmodal });
        sessionStorage.setItem("modal", JSON.stringify(newmodal));
    }

    renderModal() {
        let confirm = () => {// function called when "yes button is pressed"
            if(this.state.modal.message==="cancel your booking") this.cancelSeat(this.state.modal.lecture.Course_Ref, this.state.modal.lecture.Date, this.state.modal.index);// depending on operation, call cancel or book function
            else this.bookASeat(this.state.modal.lecture.Course_Ref, this.state.modal.lecture.Date, this.state.modal.index);
            this.modalClose();// then close modal
        }
        return (
            <Modal show={this.state.modal.show} onHide={this.modalClose} style={{marginTop: "25vh"}}>                
                <Modal.Header class="app-element-background" closeButton style={{minWidth: "498px"}}>
                    <div  style={{flexWrap: "wrap", justifyContent: "center", minWidth: "432px"}}>
                        <p style={{paddingTop: "15px", paddingBottom: "30px", fontSize: "25px", textAlign: "center"}}>Do you want to {this.state.modal.message} for this lecture?</p>
                        <div style={{display: "flex", flexWrap: "nowrap",  justifyContent: "space-around", paddingTop: "7px", paddingBottom: "7px"}}>
                            <div style={{marginLeft: "37px"}}>
                                <Button onClick={() => confirm()} variant={this.state.modal.message==="cancel your booking" ? "danger" : "primary"} style={{ marginRight: "27px", paddingRight: "17px", paddingLeft: "17px"}}>Yes</Button>
                                <Button onClick={this.modalClose} variant="secondary" style={{ paddingRight: "17px", paddingLeft: "17px"}}>No</Button>
                            </div>
                        </div>
                    </div>
                </Modal.Header>                
            </Modal>
        )
    }

    renderLectureTables(){
        return (
            <div className="app-background">
                <br/>
                <h1 className="page-title">Lectures</h1>
                <br/>
                <Table data-testid={'lectures'} striped bordered hover style={{backgroundColor: "#fff"}}>
                    <thead>
                    <tr>
                        <th>Lecture</th>
                        <th>Time and date</th>
                        <th>Lecture Booking</th>
                        <th>Cancel booking</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.lectures.map((lecture,index) =>
                        <tr key={index}>
                            <td>{lecture.Name}</td>
                            <td>{lecture.Date}</td>
                            <td>{this.renderBookASeatButton(lecture, index)}</td>
                            <td>{this.renderCancelButton(lecture, index)}</td>
                        </tr>
                    )}
                    </tbody>
                </Table>
            </div>
        )
    }

    renderContent = () => {
        if (this.state.show === 0 && this.state.lectures != null) return (this.renderLectureTables());
        else return(<div></div>);
    }

    render() {
        return (
            <>
                <StudentNavbar setShow={this.setShow}/>
                {this.renderContent()}
                {this.renderModal()}
            </>
        )
    }
}
