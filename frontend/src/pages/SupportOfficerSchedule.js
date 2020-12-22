import React, {Component} from 'react'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import{getAllSchedule} from "../api/api";
import Modal from 'react-bootstrap/Modal'

export class SupportOfficerSchedule extends Component{
    state={
        listSchedule:[],
        modal:false
    }
    componentDidMount() {
        this.updateSchedule();
    }
    updateSchedule=()=>{
        getAllSchedule()
            .then(res=>{
                this.setState({ listSchedule: res.data });
            })
            .catch(err=>{
                console.log(err);
            })
    }
    renderSchedule=()=>{
        //Fill the body of the table from fetched values
        let table = [];
        let k = 0;
        this.state.listSchedule.forEach(row => {
            table.push(<tr key={k++}>
                <td>{row.courseId}</td>
                <td>{row.courseName}</td>
                <td>{row.room}</td>
                <td>{row.day}</td>
                <td>{row.seats}</td>
                <td>{row.time}</td>
                <td style={{ display: "flex", justifyContent: "flex-start" }}><Button style={{ marginLeft: "5px" }} data-testid={"showReport_" + k++} onClick={(e) => { e.preventDefault();}}>Modify Schedule</Button></td>
            </tr>)
        });
        return(
            <Table striped bordered hover style={{ backgroundColor: "#fff" , width: "98%", margin: "auto"}}>
                <thead>
                <tr>
                    <th>CourseID</th>
                    <th>CourseName</th>
                    <th>Room</th>
                    <th>Day</th>
                    <th>Seats</th>
                    <th>Time</th>
                    <th>Update</th>
                </tr>
                </thead>
                <tbody data-testid={"listTabSL"}>
                {table}
                </tbody>
            </Table>
        )
    }
    renderModalSchedule=()=>{

    }
    render() {
        return(
            <div ><br></br><h1 className="page-title">Update schedule lectures</h1><br></br>
                <br/>
                {this.renderSchedule()}

                {this.renderModalSchedule()}
            </div>
        )
    }

}