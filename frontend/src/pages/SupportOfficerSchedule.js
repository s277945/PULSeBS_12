import React, {Component} from 'react'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import{getAllSchedule,setNewSchedule} from "../api/api";
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import TimePicker from 'react-bootstrap-time-picker';
import moment from "moment";

export class SupportOfficerSchedule extends Component{
    state={
        listSchedule:[],
        modal:false,
        elemModal:[],
        startDate:"",
        endDate:"",
        day:"",
        room:"",
        seats:""
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
    handleChangeStartTime=(date)=> {
        if(date>this.state.endDate&&this.state.endDate!=""){
            console.log("IF START DATE")
        }
        else{
            date=moment('25/12/2020', "DD/MM/YYYY").utcOffset(1).add(date, 'seconds').format("HH:mm")
            this.setState({startDate:date});
        }

        console.log('value: '+date);
    }
    handleChangeEndTime=(date)=>{
        console.log(moment('25/12/2020', "DD/MM/YYYY").utcOffset(1).add(date, 'seconds').format("HH:mm"))
        if(date<this.state.startDate){
            console.log('IF ENDDATE');
        }
        else{
            date=moment('25/12/2020', "DD/MM/YYYY").utcOffset(1).add(date, 'seconds').format("HH:mm")
            this.setState({endDate:date});
        }

        console.log(date);

    }
    handleChangeRoom=(e)=>{
        console.log(e.target.value)
        this.setState({room:e.target.value})
    }
    handleChangeDay=(e)=>{
        console.log(e.target.value)
        this.setState({day:e.target.value})
    }
    handleChangeSeats=(e)=>{
        if(e.target.value.toString().match(/[a-zA-Z]+/)){
            console.log('error')
        }
        else
            this.setState({seats:e.target.value});
    }
    /*When confirm button is pressed, first of all it should be created
        a body for PUT request, inside it there are old and new values of
        request*/
    handleConfirm=()=>{
        let body;
        let time;
        if(this.state.startDate===""||this.state.endDate===""){
            time="";
        }
        else{
            time=this.state.startDate+"-"+this.state.endDate;
        }
        body={
            courseId:this.state.elemModal.courseId,
            oldDay:this.state.elemModal.day,
            newDay:(this.state.day==="")?this.state.elemModal.day:this.state.day,
            oldTime:this.state.elemModal.time,
            newTime:(this.state.startDate===""||this.state.endDate==="")?this.state.elemModal.time:time,
            oldRoom:this.state.elemModal.room,
            newRoom:(this.state.room==="")?this.state.elemModal.room:this.state.room,
            oldSeats:this.state.elemModal.seats,
            newSeats:(this.state.seats==="")?this.state.elemModal.seats:this.state.seats}
        setNewSchedule(body)
            .then(res=>{
                //it should update the schedule table before closing modal
                let newSchedule=this.state.listSchedule.map(row=>{
                    if(row.courseId===this.state.elemModal.courseId && row.day===this.state.elemModal.day){
                        row.day=(this.state.day==="")?this.state.elemModal.day:this.state.day;
                        row.time=(time==="")?this.state.elemModal.time:time;
                        row.room=(this.state.room==="")?this.state.elemModal.room:this.state.room;
                        row.seats=(this.state.seats==="")?this.state.elemModal.seats:this.state.seats;
                    }
                    return row;

                });
                this.setState({listSchedule:newSchedule,modal:false});
            })
            .catch(err=>{
                console.log(err);
                this.setState({modal:false});
            })
    }
    handleReset=()=>{
        this.setState({
            modal:false,
            elemModal:[],
            startDate:"",
            endDate:"",
            day:"",
            room:""
        })
    }

    renderModalSchedule=()=>{
        return(
            <Modal data-testid="modalSSN" show={this.state.modal} onHide={() => { /* When the modal is closed clear the response message and the searched student */ this.setState({ modal: false,day:"",startDate:"",endDate:"",room:"",elemModal:[] });}}>
                <Modal.Header data-testid={"close"} closeButton>
                    <div>
                        <Modal.Title>
                            <div>
                                Update Schedule
                            </div>
                        </Modal.Title>
                    </div>

                </Modal.Header>
                <Modal.Body className="app-element-background">
                    <div>
                        <Form>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label style={{display: "block", textAlign: "center"}}>CourseID</Form.Label>
                                <Form.Control data-testid={"username"} type="text" plaintext readOnly placeholder={this.state.elemModal.courseId}/>
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label style={{display: "block", textAlign: "center"}}>Course Name</Form.Label>
                                <Form.Control data-testid={"username"} type="text" plaintext readOnly placeholder={this.state.elemModal.courseName}/>
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label style={{display: "block", textAlign: "center"}}>Room</Form.Label>
                                <Form.Control value={this.state.room} data-testid={"username"} type="text" placeholder={this.state.elemModal.room} onChange={this.handleChangeRoom}/>
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label style={{display: "block", textAlign: "center"}}>Seats</Form.Label>
                                <Form.Control value={this.state.seats} data-testid={"username"} type="text" placeholder={this.state.elemModal.seats} onChange={this.handleChangeSeats}/>
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label style={{display: "block", textAlign: "center"}}>Day</Form.Label>
                                <Form.Control value={this.state.day} data-testid={"username"} as={"select"} defaultValue={this.state.elemModal.day} onChange={this.handleChangeDay}>
                                    <option>Mon</option>
                                    <option>Tue</option>
                                    <option>Wed</option>
                                    <option>Thu</option>
                                    <option>Fri</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label style={{display: "block", textAlign: "center"}}>Hour {this.state.elemModal.time}</Form.Label>
                                <TimePicker format={24} value={this.state.startDate} start={"8:30"} end={"21:00"} step={30} onChange={this.handleChangeStartTime} isInvalid={(this.state.startDate>this.state.endDate&&this.state.endDate!="")}>Start</TimePicker>
                                {   (this.state.startDate>this.state.endDate&&this.state.endDate!="")
                                    ? <><Form.Text style={{color: "red", paddingTop: "5px", paddingBottom: "5px"}}>Start date should not be greater than end date</Form.Text></>
                                    : null
                                }
                                <TimePicker format={24} value={this.state.endDate} start={"8:30"} end={"21:00"} step={30} onChange={this.handleChangeEndTime} isInvalid={(this.state.endDate<this.state.startDate&&this.state.startDate!="")}>End</TimePicker>
                                {   (this.state.endDate<this.state.startDate&&this.state.startDate!="")
                                    ? <><Form.Text style={{color: "red", paddingTop: "5px", paddingBottom: "5px"}}>End date should not be less than start date</Form.Text></>
                                    : null
                                }
                            </Form.Group>
                            <div style={{display: "flex", flexWrap: "nowrap",  justifyContent: "center"}}>
                                <Button data-testid={"submit"} variant="primary" style={{marginRight: "25px", paddingRight: "17px", paddingLeft: "17px"}} onClick={this.handleConfirm}>
                                    Confirm
                                </Button>
                                <Button data-testid={"reset"} variant="danger" onClick={this.handleReset}>
                                    Cancel
                                </Button>
                            </div>
                        </Form>
                    </div>
                </Modal.Body>
            </Modal>
        )
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
                <td style={{ display: "flex", justifyContent: "flex-start" }}><Button style={{ marginLeft: "5px" }} data-testid={"showReport_" + k++} onClick={(e) => { e.preventDefault();this.setState({ modal:true,elemModal:row});}}>Modify Schedule</Button></td>
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