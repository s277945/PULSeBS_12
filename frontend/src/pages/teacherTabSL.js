 import React, { Component } from 'react'
 import Table from 'react-bootstrap/Table'
 import Button from 'react-bootstrap/Button'
 import Modal from 'react-bootstrap/Modal'
 import {updateTeacher} from './update.js'
 import { getStudentList } from '../api/api'
 import moment from 'moment'
 import { Checkbox } from 'pretty-checkbox-react';
 import { getTeacherPastLectures, setPresentStudents } from '../api/api'

 export class TeacherTabSL extends Component {


     state = { tableData: [], pastTableData: [], modalTableData: [], modalLecture: null, modal: 0, element: null }

     componentDidMount() {
         updateTeacher(this);
         getTeacherPastLectures()
            .then(res => {
                console.log(res.data);
                this.setState({ pastTableData: res.data });
            }).catch(/* istanbul ignore next */err=>{
                console.log(err);
            });
         let modal = sessionStorage.getItem("modal");//get saved modal state value
         let element = sessionStorage.getItem("element");//get saved element state value
         if(modal!==null) this.setState({ modal: parseInt(modal, 10) });
         else sessionStorage.setItem("modal", this.state.modal);//if none is present, save modal state value        
         if(JSON.parse(element)!==null) {
             this.setState({ element: JSON.parse(element),  modalLecture: JSON.parse(element) });
             this.showList(JSON.parse(element));
        }
         else sessionStorage.setItem("element", null);//if none is present, save element state value
     }


     showList = (element, num) => {
        getStudentList(element)
             .then(res => {
                console.log(res)
                if(num===1) this.setState({ modalTableData: res.data, modalLecture: element});// if future/past modal is to be rendered
                if(num===2) this.setState({ modalTableData: res.data.map(e=>{return {attendance: e.attendance, name: e.name, surname: e.surname, userId: e.userId, checked: false}}), modalLecture: element })// if attendance setting modal is to be rendered
                sessionStorage.setItem("element", JSON.stringify(element)); // update session data
                this.handleShow(num);
             }).catch(err=>{
                 console.log(err);
              });
     }

     handleClose = () => {
         sessionStorage.removeItem("modal");         
         sessionStorage.removeItem("element");
         this.setState({ modal: 0, modalLecture: null, element: null })
     }

     handleShow = (num) => {
         this.setState({ modal: num });
         sessionStorage.setItem("modal", 1);// update session data
     }

     renderFutureLectures() {
        //Create main table body        

         return (
            <div style={{width: "99%", margin: "auto"}}>
                 <Table striped bordered hover style={{backgroundColor: "#fff"}}>
                     <thead>
                         <tr>
                             <th>Course</th>
                             <th>Lecture name</th>
                             <th>Date and time</th>
                             <th style={{width: "22%", textAlign: "center"}}>List of students</th>
                         </tr>
                     </thead>
                     <tbody data-testid={"listTabSL"}>
                         {this.state.tableData.map((row,i) => {
                            return( <tr key={i}>
                                        <td>{row.Course_Ref}</td>
                                        <td>{row.Name}</td>
                                        <td>{moment(row.Date).format("DD/MM/YYYY HH:mm")}</td>
                                        <td style={{display: "flex", justifyContent: "center"}}><Button style={{marginLeft: "5px"}} data-testid={"showList_"+i} onClick={(e) => { e.preventDefault(); this.showList(row, 1) }}>SHOW LIST</Button></td>
                                    </tr>)
                            })}
                     </tbody>
                 </Table>
                 <Modal show={this.state.modal === 1 ? true : false} onHide={this.handleClose}>
                     <Modal.Header data-testid={"close"} closeButton>
                         <Modal.Title><div style={{marginLeft: "7px"}}>Students</div></Modal.Title>
                     </Modal.Header>
                     <Modal.Body className="app-element-background">{
                         <Table striped bordered hover>
                             <thead>
                                 <tr>
                                     <th>No</th>
                                     <th>Student ID</th>
                                     <th>Name</th>
                                     <th>Surname</th>
                                 </tr>
                             </thead>
                             <tbody data-testid={"studentsList"}>
                                 {this.state.modalTableData.map((element, i) => {
                                     return (<tr key={i}>
                                         <td>{i + 1}</td>
                                         <td>{element.userId}</td>
                                         <td>{element.name}</td>
                                         <td>{element.surname}</td>
                                     </tr>)
                                 })}
                             </tbody>
                         </Table>}
                     </Modal.Body>
                 </Modal>
             </div>
         )
     }
     
     renderPastLectures() {
        const resetChecks=(elem)=>{elem.setState({ 
            modalTableData: this.state.modalTableData.map(e => {
                return { userId: e.userId, name: e.name, surname: e.surname, attendance: e.attendance, checked: false }
        })})}
        const setPresence=(elem)=>{
            setPresentStudents(elem.state.modalLecture.Course_Ref, elem.state.modalLecture.Date, elem.state.modalTableData.filter(e=>e.checked).map(e=>{return {studentId: e.userId}}))            
            .then(res => {
                console.log(res)
                elem.setState({modalTableData: elem.state.modalTableData.map(e=>{
                    return { userId: e.userId, name: e.name, surname: e.surname, attendance: e.checked?1:0, checked: false }
                })})
             }).catch(err=>{
                 console.log(err);
              });
        }

        //Create main table body
         return (
            <div style={{width: "99%", margin: "auto"}}>
                 <Table striped bordered hover style={{backgroundColor: "#fff"}}>
                     <thead>
                         <tr>
                             <th>Course</th>
                             <th>Lecture name</th>
                             <th>Date and time</th>
                             <th style={{width: "22%", textAlign: "center"}}>Student attendance</th>
                         </tr>
                     </thead>
                     <tbody data-testid={"listTabSL"}>
                        {this.state.pastTableData.filter(row=>moment().diff(moment(row.Date), 'days') <= 1).map((row,i) => {
                            return (<tr key={i}>
                                        <td>{row.Course_Ref}</td>
                                        <td>{row.Name}</td>
                                        <td>{moment(row.Date).format("DD/MM/YYYY HH:mm")}</td>
                                        <td style={{display: "flex", justifyContent: "center"}}><Button style={{marginLeft: "5px"}} variant="info" data-testid={"showList_"+i} onClick={(e) => { e.preventDefault(); this.showList(row,2) }}>{"SET STUDENT ATTENDANCE"}</Button></td>
                                    </tr>)
                            })}
                        {this.state.pastTableData.filter(row=>moment().diff(moment(row.Date), 'days') > 1).map((row,i) => {
                            return (<tr key={i}>
                                        <td>{row.Course_Ref}</td>
                                        <td>{row.Name}</td>
                                        <td>{moment(row.Date).format("DD/MM/YYYY HH:mm")}</td>
                                        <td style={{display: "flex", justifyContent: "center"}}><Button style={{marginLeft: "5px"}} variant="secondary" data-testid={"showList_"+i} onClick={(e) => { e.preventDefault(); this.showList(row,2) }}>{"SHOW ATTENDANCE DATA"}</Button></td>
                                    </tr>)
                            })}
                     </tbody>
                 </Table>
                 <Modal show={this.state.modal === 2 ? true : false} onHide={this.handleClose}>
                     <Modal.Header data-testid={"close2"} closeButton>
                         <Modal.Title><div style={{marginLeft: "17px", textAlign: "center"}}>{this.state.modalLecture&&moment().diff(moment(this.state.modalLecture.Date), 'days') <= 1 ? "Set student attendance for lecture ":"Student attendance data for lecture "}</div><div style={{ marginLeft: "17px", textAlign: "center"}}>{this.state.modalLecture?this.state.modalLecture.Name:""}</div></Modal.Title>
                     </Modal.Header>
                     <Modal.Body className="app-element-background">{
                         this.state.modalLecture ?
                             <Table striped bordered hover>
                                 <thead>
                                     <tr>
                                         <th>No</th>
                                         <th>Student ID</th>
                                         <th>Name</th>
                                         <th>Surname</th>
                                         <th>Attendance</th>
                                     </tr>
                                 </thead>
                                 <tbody data-testid={"studentsList"}>
                                     {this.state.modalLecture&&moment().diff(moment(this.state.modalLecture.Date), 'days') <= 1 ? //check if user must be able to input attendance data
                                         this.state.modalTableData.map((element, i) => {
                                             return (<tr key={i}>
                                                 <td>{i + 1}</td>
                                                 <td>{element.userId}</td>
                                                 <td>{element.name}</td>
                                                 <td>{element.surname}</td>
                                                 <td style={{textAlign:"center"}}>{element.attendance===1?"Yes":"No"}</td>
                                                 <td style={{margin: "auto"}}><Checkbox disabled={element.attendance===1} checked={element.checked&&element.attendance!==1} onClick={()=>{this.setState({
                                                     modalTableData: this.state.modalTableData.map(e => {
                                                         if (e.userId === element.userId) return { userId: e.userId, name: e.name, surname: e.surname, attendance: e.attendance, checked: !e.checked }
                                                         else return e;
                                                     })
                                                 })}} /></td>
                                             </tr>)
                                         }) :
                                         this.state.modalTableData.map((element, i) => {
                                             return (<tr key={i}>
                                                 <td>{i + 1}</td>
                                                 <td>{element.userId}</td>
                                                 <td>{element.name}</td>
                                                 <td>{element.surname}</td>
                                                 <td style={{textAlign:"center"}}>{element.attendance===1?"Yes":"No"}</td>
                                             </tr>)
                                         })}
                                 </tbody>
                             </Table> :
                             <div />}
                             {this.state.modalLecture&&moment().diff(moment(this.state.modalLecture.Date), 'days') <= 1 ?
                             <div style={{display:"flex", justifyContent:"flex-end"}}>
                                <Button style={{marginRight: "10px"}} disabled={this.state.modalTableData.filter(e=>e.checked).length<1} onClick={(e)=>{e.preventDefault(); setPresence(this);}}>Mark as present</Button>
                                <Button variant="secondary" disabled={this.state.modalTableData.filter(e=>e.checked).length<1} onClick={(e)=>{e.preventDefault(); resetChecks(this);}}>Reset selection</Button>
                             </div>
                             :<div/>}
                     </Modal.Body>
                 </Modal>
             </div>
         )
     }

     render() {
         return(
             <div className="app-background">
                <br />
                <h1 className="page-title">Student list</h1>
                <br />
                <h5 style={{margin: "10px", marginBottom: "17px"}}>Programmed lectures info:</h5>
                {this.renderFutureLectures()}
                <div style={{marginBottom: "34px"}}/>
                <h5 style={{margin: "10px", marginBottom: "17px"}}>Past and current lectures attendance:</h5>
                {this.renderPastLectures()}
            </div>
         );
     }
 }
