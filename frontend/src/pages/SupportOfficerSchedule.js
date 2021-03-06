import React, {Component} from 'react'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import{getAllSchedule,setNewSchedule} from "../api/api";
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import TimePicker from 'react-bootstrap-time-picker';
import moment from "moment";
import { toast } from 'react-toastify';
import {Row,Col} from 'react-bootstrap';
export class SupportOfficerSchedule extends Component{
    state={
        listSchedule:[],
        modal:false,
        elemModal:[],
        startDate:"",
        endDate:"",
        day:"",
        room:"",
        seats:"",
        error:false
    }
    componentDidMount() {
        this.updateSchedule();
    }
    /*The function retrieve the list of all the schedule from network, and stores the result inside
    * a vector*/
    updateSchedule=()=>{
        getAllSchedule()
            .then(res=>{
                this.setState({ listSchedule: res.data });
            })
            .catch(/* istanbul ignore next */err=>{
                console.log(err);
            })
    }
    /*The following handler will be invoked each time an item is selected from TimePicker
    * First of all,TimePicker returns a value that is equal to time in seconds, so i have to
    * convert result in HH:mm notation.In the next step it will be checked if the picked value is LT
    * endTime(otherwise the value is not updated). */
    handleChangeStartTime=(date, endDate)=> {
        date=moment('25/12/2020', "DD/MM/YYYY").utcOffset(1).add(date, 'seconds').format("HH:mm")
        /* istanbul ignore else */
        if(this.state.endDate!=="") endDate = this.state.endDate;
        if(moment(date, "HH:mm").isSameOrAfter(moment(endDate, "HH:mm"))){
            console.log("IF START DATE")
        }
        else{
            this.setState({startDate:date,error:false});
        }

        console.log("startDate:"+this.state.startDate);
        console.log("endDate:"+this.state.endDate);
    }
    /*In input we have a string like: 08:30-10:30 or 08:30:10:30.
    * This function returns an array of value, in which tmp[0] is startValue and tmp[1] endValue.
    * */
    splitString=()=>{
        let tmp=[];
        if(this.state.elemModal.time!==undefined){
            tmp=this.state.elemModal.time.toString().split('-');
            console.log(JSON.stringify(tmp));
            if(tmp.length===1){
                //separator is not - char, so i have to split the string by :
                let array=[];
                array=this.state.elemModal.time.toString().split(':');
                console.log("array: "+JSON.stringify(array));
                tmp=[];
                tmp.push(array[0]+":"+array[1]);
                tmp.push(array[2]+":"+array[3]);
                console.log("tmp: "+tmp);
            }
        }
        return tmp;
    }
    /*The following handler will be invoked each time an item is selected from TimePicker
    * First of all,TimePicker returns a value that is equal to time in seconds, so i have to
    * convert result in HH:mm notation.In the next step it will be checked if the picked value is GT
    * endTime(otherwise the value is not updated). */
    handleChangeEndTime=(date, startDate)=>{
        date=moment('25/12/2020', "DD/MM/YYYY").utcOffset(1).add(date, 'seconds').format("HH:mm")
        console.log(moment('25/12/2020', "DD/MM/YYYY").utcOffset(1).add(date, 'seconds').format("HH:mm"))        
        if(this.state.startDate!=="") startDate = this.state.startDate;
        if(moment(date, "HH:mm").isSameOrBefore(moment(startDate, "HH:mm"))){
            console.log('IF ENDDATE');
        }
        else{
            this.setState({endDate:date,error:false});
        }

        console.log("startDate:"+this.state.startDate);
        console.log("endDate:"+this.state.endDate);

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
    handleDisabled=(elem)=>{
        return ((elem.state.startDate===""&&elem.state.endDate===""&&elem.state.seats===""&&elem.state.room===""&&elem.state.day==="")||elem.state.error)
    }
    /*When confirm button is pressed, first of all it should be created
        a body for PUT request, inside it there are old and new values of
        request*/
    handleConfirm=()=>{
        console.log('handle confirm');
        let body;
        let time="";
        //i have to consider both the case in which I choose only one of the two dates:
        let tmp=[];
        tmp=this.splitString();
        console.log("splitString: "+tmp);

        if(this.state.startDate===""&&this.state.endDate===""){
            time="";
        }
        else if(this.state.startDate!==""&&this.state.endDate===""){
            console.log("tmp1: "+tmp[1]);
            console.log("start: "+this.state.startDate);
            time=this.state.startDate+"-"+tmp[1];
        }

        else if(this.state.startDate===""&&this.state.endDate!==""){
            console.log("tmp0: "+tmp[0]);
            console.log("end: "+this.state.endDate);
            time=tmp[0]+"-"+this.state.endDate;
        }
        else{
            time=this.state.startDate+"-"+this.state.endDate;
        }
        /* istanbul ignore else */
        if(time!=""||this.state.day!==""||this.state.room!==""||this.state.seats!==""){
            body={
                courseId:this.state.elemModal.courseId,
                oldDay:this.state.elemModal.day,
                newDay:(this.state.day==="")?this.state.elemModal.day:this.state.day,
                oldTime:this.state.elemModal.time,
                newTime:(time==="")?this.state.elemModal.time:time,
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
                    toast.info("Schedule of "+this.state.elemModal.courseName+" correctly modified")
                    this.setState({
                        listSchedule:newSchedule,
                        modal:false,
                        elemModal:[],
                        startDate:"",
                        endDate:"",
                        day:"",
                        room:"",
                        seats:"",
                        error:false
                    });
                })
                .catch(err=>{
                    console.log(err);
                    toast.error("Server error: error sending data to server")
                    this.setState({
                        modal:false,
                        elemModal:[],
                        startDate:"",
                        endDate:"",
                        day:"",
                        room:"",
                        seats:"",
                        error:false
                    });
                })
        }
        /*else{
            console.log("Nothing to modify");
            toast.info("Nothing to modify");
            this.setState({
                modal:false,
                elemModal:[],
                startDate:"",
                endDate:"",
                day:"",
                room:"",
                seats:""});
        }*/

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
        let tmp=[];
        tmp=this.splitString();
        return(
            <Modal data-testid="modal" show={this.state.modal} onHide={() => { /* When the modal is closed clear the response message and the searched student */ this.setState({ modal: false,day:"",startDate:"",endDate:"",room:"",elemModal:[] });}}>
                <Modal.Header data-testid={"close"} closeButton>
                    <div>
                        <Modal.Title>
                            <div style={{marginLeft: "140px"}}>
                                Update Schedule
                            </div>
                        </Modal.Title>
                    </div>

                </Modal.Header>
                <Modal.Body className="app-element-background">
                    <div>
                        <Form>
                            <Form.Group controlId="formBasicEmail">
                                <Row>
                                    <Col>
                                        <Form.Label style={{display: "block", textAlign: "center"}}><b>CourseID</b></Form.Label>
                                        <Form.Control style={{display: "block", textAlign: "center"}} data-testid={"courseId"} type="text" plaintext readOnly placeholder={this.state.elemModal.courseId}/>
                                    </Col>
                                    <Col xs={9} style={{borderLeft:"solid", borderWidth: "1px", borderColor: "#dddddd"}}>
                                        <Form.Label style={{display: "block", textAlign: "center"}}><b>Course Name</b></Form.Label>
                                        <Form.Control style={{display: "block", textAlign: "center"}} data-testid={"name"} type="text" plaintext readOnly placeholder={this.state.elemModal.courseName}/>
                                    </Col>
                                </Row>
                                </Form.Group>
                            <Form.Group controlId="formBasicField">
                                <Row>
                                    <Col>
                                        <Form.Label style={{display: "block", textAlign: "center"}}><b>Room</b></Form.Label>
                                        <Form.Control  value={this.state.room} data-testid={"room"} type="text" placeholder={this.state.elemModal.room} onChange={this.handleChangeRoom}/>
                                    </Col>
                                    <Col>
                                        <Form.Label style={{display: "block", textAlign: "center"}}><b>Seats</b></Form.Label>
                                        <Form.Control value={this.state.seats} data-testid={"seats"} type="text" placeholder={this.state.elemModal.seats} onChange={this.handleChangeSeats}/>
                                    </Col>
                                    <Col>
                                        <Form.Label style={{display: "block", textAlign: "center"}}><b>Day</b></Form.Label>
                                        <Form.Control value={(this.state.day==="")?this.state.elemModal.day:this.state.day} data-testid={"day"} as={"select"} onChange={this.handleChangeDay}>
                                            <option key={0} value={"Mon"}>Mon</option>
                                            <option key={1} value={"Tue"}>Tue</option>
                                            <option key={2} value={"Wed"}>Wed</option>
                                            <option key={3} value={"Thu"}>Thu</option>
                                            <option key={4} value={"Fri"}>Fri</option>
                                        </Form.Control>
                                    </Col>

                                </Row>
                            </Form.Group>
                            <Form.Group controlId="formTime">
                                <Row>
                                    <Col>
                                        <Form.Label style={{display: "block", textAlign: "center"}}><b>Start Hour</b></Form.Label>
                                        <TimePicker data-testid={"startTime"} format={24} initialValue={tmp[0]} value={this.state.startDate} start={"8:30"} end={"21:00"} step={30} onChange={e=>{this.handleChangeStartTime(e,tmp[1])}} isInvalid={(moment((this.state.startDate===""?tmp[0]:this.state.startDate)).isAfter((this.state.endDate===""?tmp[1]:this.state.endDate)))}>Start</TimePicker>
                                        {   (moment((this.state.startDate===""?tmp[0]:this.state.startDate)).isAfter((this.state.endDate===""?tmp[1]:this.state.endDate)))
                                            ?<><Form.Text style={{color: "red", paddingTop: "5px", paddingBottom: "5px"}}>Start date should not be greater than end date</Form.Text></>
                                            : null
                                        }
                                    </Col>
                                    <Col>
                                        <Form.Label style={{display: "block", textAlign: "center"}}><b>End Hour</b></Form.Label>
                                        <TimePicker data-testid={"endTime"} format={24} initialValue={tmp[1]} value={this.state.endDate} start={"8:30"} end={"21:00"} step={30} onChange={e=>{this.handleChangeEndTime(e,tmp[0])}} isInvalid={(moment((this.state.endDate===""?tmp[1]:this.state.endDate)).isBefore((this.state.startDate===""?tmp[0]:this.state.startDate)))}>End</TimePicker>
                                        {   //case in which i already have both end and startDate. if it is the
                                            (moment((this.state.endDate===""?tmp[1]:this.state.endDate)).isBefore((this.state.startDate===""?tmp[0]:this.state.startDate)))
                                            ?<><Form.Text style={{color: "red", paddingTop: "5px", paddingBottom: "5px"}}>End date should not be less than start date</Form.Text></>
                                            : null
                                        }
                                    </Col>
                                </Row>
                            </Form.Group>
                            <div style={{display: "flex", flexWrap: "nowrap",  justifyContent: "center"}}>
                                <Button disabled={this.handleDisabled(this)} data-testid={"submit"} variant="primary" style={{marginRight: "25px", paddingRight: "17px", paddingLeft: "17px"}} onClick={this.handleConfirm}>
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
                <td><div style={{ display: "flex", justifyContent: "center" }}>{row.room}</div></td>
                <td><div style={{ display: "flex", justifyContent: "center" }}>{row.day}</div></td>
                <td><div style={{ display: "flex", justifyContent: "center" }}>{row.seats}</div></td>
                <td><div style={{ display: "flex", justifyContent: "center" }}>{row.time}</div></td>
                <td style={{ display: "flex", justifyContent: "center" }}><Button style={{ marginLeft: "5px" }} data-testid={"showReport_" + k++} onClick={(e) => { e.preventDefault();this.setState({ modal:true,elemModal:row});}}>Modify Schedule</Button></td>
            </tr>)
        });
        return(
            <Table striped bordered hover style={{ backgroundColor: "#fff" , width: "98%", margin: "auto"}}>
                <thead>
                <tr>
                    <th>CourseID</th>
                    <th>CourseName</th>
                    <th style={{width: "4%", textAlign: "center"}}>Room</th>
                    <th style={{width: "6%", textAlign: "center"}}>Day</th>
                    <th style={{width: "6%", textAlign: "center"}}>Seats</th>
                    <th style={{width: "6%", textAlign: "center"}}>Time</th>
                    <th style={{width: "12%", textAlign: "center"}}>Update</th>
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
            <div ><br></br><h1 className="page-title">Lecture schedule setup</h1><br></br>
                <br/>
                {this.renderSchedule()}
                {this.renderModalSchedule()}
            </div>
        )
    }

}