import React, { Component } from 'react'
import axios from 'axios'
import StudentNavbar from './studentNavbar'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import {authContext} from '../components/Authsystem'

export class StudentHome extends Component {
    static contextType = authContext

    state = {
        show : 0, //This state variable is used to choose the content to show
        lectures: null,
    }

    componentDidMount() {
        axios.get(`http://localhost:3001/api/lectures`, { withCredentials: true }).then((reponse) => {
            this.setState({ lectures: reponse.data })
            this.getBookedLectures();
        }).catch(err=>{ 
            console.log(err);
         });
    }

    setShow = (val) => { //Function to set the show variable
        this.setState({show : val});
    }

    getBookedLectures(){

        axios.get(`http://localhost:3001/api/lectures/booked`, { withCredentials: true}).then((reponse) => {
            const newLectureArray = this.state.lectures.slice()
            reponse.data.map(bookedLecture => {
                const index = this.state.lectures.findIndex(lecture =>
                    lecture.Course_Ref === bookedLecture.Course_Ref && lecture.Date === bookedLecture.Date_Ref
                )
                newLectureArray[index].alreadyBooked = true;
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
        axios.post(`http://localhost:3001/api/lectures`, body, { withCredentials: true})
            .then(response => {
                const newLectures = this.state.lectures.slice();
                newLectures[index].alreadyBooked = true
                this.setState({lectures: newLectures})
            }).catch(err=>{ 
                console.log(err);
             });
    }

    cancelSeat(lectureId, date, index){
        axios.delete(`http://localhost:3001/api/lectures/${lectureId}?date=${date}`, { withCredentials: true})
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
            <div class="app-background">
                <br></br>
                <Table striped bordered hover style={{backgroundColor: "#fff"}}>
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


    render() {
        return (
            <>
                <StudentNavbar setShow={this.setShow} />
                {this.state.show === 0 && this.state.lectures != null &&
                    this.renderLectureTables()
                }
            </>
        )
    }
}
