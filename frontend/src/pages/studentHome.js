import React, { Component } from 'react'
import axios from 'axios'
import { StudentNavbar } from './studentNavbar'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import userIdentity from '../api/userIdentity.js'

export class StudentHome extends Component {
    state = {
        show : 0, //this state variable is used to choose the content to show
        lectures: null,
    }

    componentDidMount() {
        if(!this.props.context.userName || !this.props.context.userType || this.props.context.userType!=='s') this.props.history.push("/"); //open page only if a valid session has been started
                const user = userIdentity.getUserSession();
        axios.get(`http://localhost:3001/api/lectures`, { user : user, withCredentials: true}).then((reponse) => {
            // console.log(reponse.data)
            this.setState({lectures: reponse.data})
            this.getBookedLectures();
        }).catch(err=>{ userIdentity.removeUserSession(this.props.context); console.log(err) });

    }

    setShow = (val) => { //function to set the show variable
        this.setState({show : val});
    }

    getBookedLectures(){
        const user = userIdentity.getUserSession();

        axios.get(`http://localhost:3001/api/lectures/booked`, { user : user, withCredentials: true}).then((reponse) => {
            const newLectureArray = this.state.lectures.slice()
            reponse.data.map(bookedLecture => {
                const index = this.state.lectures.findIndex(lecture =>
                    lecture.Course_Ref === bookedLecture.Course_Ref && lecture.Date === bookedLecture.Date_Ref
                )
                newLectureArray[index].alreadyBooked = true;
            })
            this.setState({lectures: newLectureArray})
        }).catch(err=>{ userIdentity.removeUserSession(this.props.context);console.log(err) });
    }


    bookASeat(lectureId, date, index){
        const user = userIdentity.getUserSession();
        const body = {
            lectureId: lectureId,
            date: date
        }
        axios.post(`http://localhost:3001/api/lectures`, body, {user: user, withCredentials: true})
            .then(response => {
                const newLectures = this.state.lectures.slice();
                newLectures[index].alreadyBooked = true
                this.setState({lectures: newLectures})
            }).catch(err=>{ userIdentity.removeUserSession(this.props.context);console.log(err) });
    }

    cancelSeat(lectureId, date, index){
        const user = userIdentity.getUserSession();
        axios.delete(`http://localhost:3001/api/lectures/${lectureId}?date=${date}`, {user: user, withCredentials: true})
            .then(response => {
                console.log(response)
                const newLectures = this.state.lectures.slice();
                newLectures[index].alreadyBooked = false
                this.setState({lectures: newLectures})
            }).catch(err=>{ userIdentity.removeUserSession(this.props.context);console.log(err) });
    }

    renderBookASeatButton(lecture, index){
        return(
            <>
            {lecture.alreadyBooked &&
                <Button disabled>Book Seat</Button>
            }
            {!lecture.alreadyBooked &&
                <Button onClick={() => this.bookASeat(lecture.Course_Ref, lecture.Date, index)}>Book Seat</Button>
            }
            </>
        )
    }

    renderCancelButton(lecture, index){
        return (
            <>
            {lecture.alreadyBooked && 
                <Button onClick={() => this.cancelSeat(lecture.Course_Ref, lecture.Date, index)} variant="danger">Cancel</Button>
            }
            {!lecture.alreadyBooked && 
                <Button variant="danger" disabled>Cancel</Button>
            }
            </>
        )
    }

    renderLectureTables(){
        return (
            <Table striped bordered hover>
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
        )
    }

    render() {
        return (
            <>
                <StudentNavbar setShow={this.setShow} history={this.props.history} context={this.props.context}/>
                {this.state.show === 0 && this.state.lectures != null &&
                    this.renderLectureTables()
                }
            </>
        )
    }
}
