import React, { Component } from 'react'
import axios from 'axios'
import { StudentNavbar } from './studentNavbar'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import userIdentity from '../api/userIdentity.js'

export class StudentHome extends Component {
    state = {
        show : 0, //this state variable is used to choose the content to show
        lectures: null
    }

    componentDidMount() {
        if(!this.props.context.userName || !this.props.context.userType) this.props.history.push("/"); //open page only if a valid session has been started

    }

    setShow = (val) => { //function to set the show variable
        this.setState({show : val});
    }


    componentDidMount(){
        const user = userIdentity.getUserSession();
        console.log(user)
        axios.get(`http://localhost:3001/api/lectures`, { user : user, withCredentials: true}).then((reponse) => {
            console.log(reponse)
            this.setState({lectures: reponse.data})
        })
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
                        <td><Button>Book Seat</Button></td>
                        <td><Button variant="danger">Cancel</Button></td>
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
