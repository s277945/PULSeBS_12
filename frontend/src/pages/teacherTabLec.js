import React, { Component } from 'react'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import {updateTeacher} from './update.js'
import { cancelLecture, lectreTurnToDistance } from '../api/api'
import moment from 'moment'
moment().format();




export class TeacherTabLec extends Component {


    state = {
                tableData: [],
                modalShow: false,
                selectedLec: {},
                popup: {show: false, message: ""}
            }

    componentDidMount() {

        if(this.props.tour.isTourOpen) {
            this.setState(this.props.tour.getTourState())
            return
        }

        this.getPageData()
        }

    getPageData = () =>{
        
        updateTeacher(this);

        let modalShow = sessionStorage.getItem("modalShow");//get saved modalShow state value
        let popup = sessionStorage.getItem("popup");//get saved popup state value
        let selectedLec = sessionStorage.getItem("selectedLec");//get saved selectedLec value
        if(modalShow!==null) this.setState({ modalShow: JSON.parse(modalShow) });
        else sessionStorage.setItem("modalShow", JSON.stringify(this.state.modalShow));//if none is present, save modalShow state value
        if(popup!==null) this.setState({ popup: JSON.parse(popup) });
        else sessionStorage.setItem("popup", JSON.stringify(this.state.popup));//if none is present, save popup state value
        if(selectedLec!==null) this.setState({ selectedLec: JSON.parse(selectedLec) });
        else sessionStorage.setItem("selectedLec", JSON.stringify(this.state.selectedLec));//if none is present, save selectedLec state value
    }

    componentDidUpdate(prevProps){
        if(!this.props.tour.isTourOpen && prevProps.tour.isTourOpen){
            this.getPageData()
        }

        if(this.props.tour.isTourOpen && !prevProps.tour.isTourOpen){
            this.setState(this.props.tour.getTourState())
        }
     }

    showModifications = (element) => {

        this.setState({ selectedLec: element })
        sessionStorage.setItem("selectedLec", JSON.stringify(element));
        this.handleShow()
    }

    handleClose = () => {
        this.setState({ modalShow: false })
        sessionStorage.removeItem("modalShow");
        sessionStorage.removeItem("selectedLec");
    }

    handleShow = () => {
        this.setState({ modalShow: true })
        sessionStorage.setItem("modalShow", JSON.stringify(true));
    }

    handleConfirm = (e, cancel) => {// cancel is set to true if action to confirm is cancel lecture
        e.preventDefault();
        if (cancel===true ) {
            cancelLecture(this.state.selectedLec.Course_Ref, this.state.selectedLec.Date)
            .then(response=> {
                this.setState({ modalShow: false })
            })
            .catch(/* istanbul ignore next */err => {
                console.log(err);
            });
            let newTable = this.state.tableData.filter(element=>{return element.Course_Ref!==this.state.selectedLec.Course_Ref || (element.Course_Ref===this.state.selectedLec.Course_Ref&&element.Date!==this.state.selectedLec.Date)});
            this.setState({ tableData: newTable});
        }
        else {
            lectreTurnToDistance({ courseId: this.state.selectedLec.Course_Ref, date: this.state.selectedLec.Date })
            .then(response=> {
                this.setState({ modalShow: false })
            })
            .catch(/* istanbul ignore next */err => {
                console.log(err);
            });
            let newTable = this.state.tableData.map(element=>{
                                                    if (!(element.Course_Ref!==this.state.selectedLec.Course_Ref || (element.Course_Ref===this.state.selectedLec.Course_Ref&&element.Date!==this.state.selectedLec.Date))) {
                                                        element.Type="d";                                                        
                                                    }
                                                    return element
                                                });
            this.setState({ tableData: newTable});
        }
    }

    popupClose = () => {
        this.setState({ popup: {show: 0, message: ""} });
        sessionStorage.removeItem("popup");
    }

    setPopup = (message) => {// set popup state variables to passed values and show popup
        let newpopup = {show: 1, message: message};
        this.setState({ popup: newpopup });
        sessionStorage.setItem("popup", JSON.stringify(newpopup));
    }

    renderPopup() {
        let confirm = (e) => {// function called when lecture action button is pressed
            if(this.state.popup.message==="cancel this lecture")  {// depending on operation, call cancel or turn to distance function
                this.handleConfirm(e, true); // call cancel function

            }
            else {
                this.handleConfirm(e, false);// call turn to distance function
            }
            this.handleClose();// close modal
            this.popupClose();// then close popup

        }
        /* istanbul ignore if */
        if(this.state.popup.message==="cancel this lecture"&&moment(this.state.selectedLec.Date).diff(moment(), 'minutes', true)<=60.00&&this.state.popup.show==1) { this.popupClose(); return;} // check if popup can open
        /* istanbul ignore if */
        if(this.state.popup.message!=="cancel this lecture"&&moment(this.state.selectedLec.Date).diff(moment(), 'minutes', true)<=30.00&&this.state.popup.show==1) { this.popupClose(); return;}
        /* istanbul ignore else */
        return (
            <Modal data-testid="popup" show={this.state.popup.show} onHide={this.popupClose} style={{marginTop: "25vh", marginLeft: "5px"}}>
                <Modal.Header class="app-element-background" closeButton style={{minWidth: "498px"}}>
                    <div  style={{flexWrap: "wrap", justifyContent: "center", minWidth: "432px"}}>
                        <p style={{paddingTop: "15px", paddingBottom: "30px", fontSize: "25px", textAlign: "center"}}>Do you want to {this.state.popup.message} ?</p>
                        <div style={{display: "flex", flexWrap: "nowrap",  justifyContent: "space-around", paddingTop: "7px", paddingBottom: "7px"}}>
                            <div style={{marginLeft: "37px"}}>
                                <Button onClick={(e) => confirm(e)} variant={this.state.popup.message==="cancel this lecture" ? "danger" : "info"} style={{ marginRight: "27px", paddingRight: "17px", paddingLeft: "17px"}}>Yes</Button>
                                <Button onClick={this.popupClose} variant="secondary" style={{ paddingRight: "17px", paddingLeft: "17px"}}>No</Button>
                            </div>
                        </div>
                    </div>
                </Modal.Header>
            </Modal>
        )
    }

    renderModal() {// function that returns modal for lecture actions
        let tableBody = []
        let k=0;
        this.state.tableData.forEach(element => {
            tableBody.push(<tr key={k++}>
                <td>{element.Course_Ref}</td>
                <td>{element.Name}</td>
                <td>{moment(element.Date).format('YYYY-MM-DD HH:mm')}</td>
                <td style={{display: "flex", justifyContent: "center"}}><Button tour-selec="LecButton" data-testid={"showCourse_"+k++} onClick={(e) => { e.preventDefault(); this.showModifications(element) }}>SELECT</Button></td>
            </tr>)
        });
        return (
            <div >
                <br/>
                <h1 className="page-title">Lectures</h1>
                <br/>
                <div tour-selec="LecTable">
                <Table striped bordered hover style={{backgroundColor: "#fff", width: "95%", margin: "auto"}}>
                    <thead>
                        <tr>
                            <th>Course</th>
                            <th>Lecture name</th>
                            <th>Date and time</th>
                            <th style={{width: "9%", textAlign: "center"}}>Modifications</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableBody}
                    </tbody>
                </Table>
                </div>
                <Modal show={this.state.modalShow} onHide={this.handleClose} style={{marginTop: "17vh"}}>
                    <Modal.Header style={{flexWrap: "no-wrap", minWidth: "508px"}} data-testid={"close"} closeButton>
                        <div>
                            <Modal.Title style={{marginLeft: "43px", marginTop: "17px"}}>
                                <div><p style={{fontWeight:'bold', display: "inline"}}>Lecture:  </p><p style={{display: "inline", marginLeft: "10px"}}>{this.state.selectedLec.Name}</p></div>
                                <div><p style={{fontWeight:'bold', display: "inline"}}>Date: </p><p style={{display: "inline", marginLeft: "10px"}}>{moment(this.state.selectedLec.Date).format('YYYY-MM-DD HH:mm')}</p></div>
                                <br></br>
                                {}
                                {moment(this.state.selectedLec.Date).diff(moment(), 'minutes', true)<=60.00 ?
                                <div><p style={{fontWeight:'bold', fontSize: "small", color: "#e00d0d"}}>Lectures cannot be cancelled if there is less than 1 hour left to their scheduled time</p></div>
                                : <div><p style={{fontSize: "small"}}>Lectures cannot be cancelled if there is less than 1 hour left to their scheduled time</p></div>
                                }
                                {moment(this.state.selectedLec.Date).diff(moment(), 'minutes', true)<=30.00 ?
                                    <div><p style={{fontWeight:'bold', fontSize: "small", color: "#e00d0d"}}>Lectures cannot be changed to distance lectures if there are less than 30 minutes left to their scheduled time</p></div>
                                    : <div><p style={{fontSize: "small"}}>Lectures cannot be changed to distance lectures if there are less than 30 minutes left to their scheduled time</p></div>
                                }
                            </Modal.Title>
                            <div style={{display: "flex", flexWrap: "no-wrap", justifyContent: "flex-end", marginTop: "27px"}}>
                                <Button disabled={moment(this.state.selectedLec.Date).diff(moment(), 'minutes', true)<=60.00?true:false} variant="danger" style={{marginLeft: "27px", marginTop: "17px", marginBottom: "17px", paddingLeft: "11px", paddingRight: "11px" }} onClick={(e) => { e.preventDefault(); this.setPopup("cancel this lecture"); }}>CANCEL LECTURE</Button>
                                <Button disabled={moment(this.state.selectedLec.Date).diff(moment(), 'minutes', true)<=30.00||this.state.selectedLec.Type!=='p'?true:false} variant="info" style={{marginLeft: "17px", marginTop: "17px", marginBottom: "17px", paddingLeft: "11px", paddingRight: "11px" }} onClick={(e) => { e.preventDefault(); this.setPopup("turn this lecture into a distance lecture"); }}>TURN INTO DISTANCE LECTURE</Button>
                            </div>
                        </div>
                    </Modal.Header>
                </Modal>
            </div>
        )
    }

    enableAction = (type) => {// function that checks if certain action is avaiable

    }
    render() {


        return (
            <div>
                {this.renderModal()}
                {this.renderPopup()}
            </div>
        )
    }
}
