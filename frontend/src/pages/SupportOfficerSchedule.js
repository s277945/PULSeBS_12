import React, {Component} from 'react'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import{getAllSchedule} from "../api/api";
import Modal from 'react-bootstrap/Modal'
import moment from "moment";

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
                <td style={{ display: "flex", justifyContent: "flex-start" }}><Button style={{ marginLeft: "5px" }} data-testid={"showReport_" + k++} onClick={(e) => { e.preventDefault();this.setState({ modal: true });this.renderModalSchedule(row)}}>Modify Schedule</Button></td>
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
    renderModalSchedule=(row)=>{
        console.log(JSON.stringify(row));
        console.log("modal show: "+this.state.modal)
        let obj=row;
        return(
            <Modal data-testid="modalSSN" show={this.state.modal} onHide={() => { /* When the modal is closed clear the response message and the searched student */ this.setState({ modal: false });}}>
                <Modal.Header data-testid={"close"} closeButton>
                    <div>
                        <Modal.Title>
                            <div>
                                Update Schedule
                            </div>
                        </Modal.Title>
                        <div style={{display: "flex", flexWrap: "no-wrap", justifyContent: "flex-end", marginTop: "27px"}}>
                            <Button variant="danger" style={{marginLeft: "27px", marginTop: "17px", marginBottom: "17px", paddingLeft: "11px", paddingRight: "11px" }} onClick={(e) => { e.preventDefault();}}>CONFIRM</Button>
                            <Button variant="info" style={{marginLeft: "17px", marginTop: "17px", marginBottom: "17px", paddingLeft: "11px", paddingRight: "11px" }} onClick={(e) => { e.preventDefault();this.setState({modal:false})}}>CANCEL</Button>
                        </div>
                    </div>

                </Modal.Header>
                <Modal.Body className="app-element-background">
                    <div>
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
                            <tbody data-testid={"modalScheduleTab"}>
                                <tr>
                                    <td>{row.courseId}</td>
                                    <td>{row.courseName}</td>
                                    <td>{row.room}</td>
                                    <td>{row.day}</td>
                                    <td>{row.seats}</td>
                                    <td>{row.time}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                </Modal.Body>
            </Modal>
        )
    }
    render() {
        return(
            <div ><br></br><h1 className="page-title">Update schedule lectures</h1><br></br>
                <br/>
                {this.renderSchedule()}

            </div>
        )
    }

}