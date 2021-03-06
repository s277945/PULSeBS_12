 import React, { Component } from 'react'
 import Table from 'react-bootstrap/Table'
 import Button from 'react-bootstrap/Button'
 import Modal from 'react-bootstrap/Modal'
 import {updateTeacher} from './update.js'
 import { getStudentList } from '../api/api'
 import moment from 'moment'
 import { Checkbox } from 'pretty-checkbox-react';
 import { getTeacherPastLectures, setPresentStudents } from '../api/api'
 import Accordion from 'react-bootstrap/Accordion'
 import Card from 'react-bootstrap/Card'
 import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';

 export class TeacherTabSL extends Component {


     state = { tableData: [], pastTableData: [], modalTableData: [], modalLecture: null, modal: 0, element: null }

     componentDidMount() {
        //If tour is open set state with tour data
        if(this.props.tour.isTourOpen) {
            this.setState(this.props.tour.getTourState())
            return
        }

        this.getPageData()

         }

     getPageData = () =>{
        
        updateTeacher(this);
         getTeacherPastLectures()
            .then(res => {
                console.log("Past data:");
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

     componentDidUpdate(prevProps){
        if(!this.props.tour.isTourOpen && prevProps.tour.isTourOpen){
            this.getPageData()
        }

        if(this.props.tour.isTourOpen && !prevProps.tour.isTourOpen){
            this.setState(this.props.tour.getTourState())
        }
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
            <div style={{width: "95%", margin: "auto"}}>
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
                                        <td style={{display: "flex", justifyContent: "center"}}><Button tour-selec="showList" style={{marginLeft: "5px"}} data-testid={"showList_"+i} onClick={(e) => { e.preventDefault(); this.showList(row, 1) }}>SHOW LIST</Button></td>
                                    </tr>)
                            })}
                     </tbody>
                 </Table>
                 <Modal show={this.state.modal === 1 ? true : false} dialogClassName="custom-modal-2" onHide={this.handleClose} size="lg" style={{marginTop: "10vh"}}>
                     <Modal.Header data-testid={"close"} closeButton>
                         <Modal.Title><div style={{marginLeft: "230px", fontWeight: "bold"}}>Students</div></Modal.Title>
                     </Modal.Header>
                     <Modal.Body className="app-element-background">{
                         <Table striped bordered hover style={{margin:"auto"}}>
                             <thead>
                                 <tr>
                                     <th style={{width:"17px", textAlign: "center"}}>{"No"}</th>
                                     <th style={{width:"110px", textAlign: "center"}}>Student ID</th>
                                     <th><div style={{marginLeft: "3px", marginRight: "3px"}}>Name</div></th>
                                     <th><div style={{marginLeft: "3px", marginRight: "3px"}}>Surname</div></th>
                                 </tr>
                             </thead>
                             <tbody data-testid={"studentsList"}>
                                 {this.state.modalTableData.map((element, i) => {
                                     return (<tr key={i}>
                                         <td style={{textAlign: "center"}}>{i + 1}</td>
                                         <td style={{textAlign: "center"}}>{element.userId}</td>
                                         <td><div style={{marginLeft: "7px", marginRight: "7px"}}>{element.name}</div></td>
                                         <td><div style={{marginLeft: "7px", marginRight: "7px"}}>{element.surname}</div></td>
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
        const setChecks=(elem)=>{elem.setState({ 
            modalTableData: this.state.modalTableData.map(e => {
                return { userId: e.userId, name: e.name, surname: e.surname, attendance: e.attendance, checked: true }
        })})}
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
            <div style={{width: "95%", margin: "auto"}}>
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
                                        <td style={{display: "flex", justifyContent: "center"}}><Button tour-selec="setAttendance" style={{marginLeft: "5px"}} variant="info" data-testid={"showList_"+i} onClick={(e) => { e.preventDefault(); this.showList(row,2) }}>{"SET STUDENT ATTENDANCE"}</Button></td>
                                    </tr>)
                            })}
                        {this.state.pastTableData.filter(row=>moment().diff(moment(row.Date), 'days') > 1).map((row,i) => {
                            return (<tr key={i}>
                                        <td>{row.Course_Ref}</td>
                                        <td>{row.Name}</td>
                                        <td>{moment(row.Date).format("DD/MM/YYYY HH:mm")}</td>
                                        <td style={{display: "flex", justifyContent: "center"}}><Button tour-selec="showPast" style={{marginLeft: "5px"}} variant="secondary" data-testid={"showList_"+i} onClick={(e) => { e.preventDefault(); this.showList(row,2) }}>{"SHOW ATTENDANCE DATA"}</Button></td>
                                    </tr>)
                            })}
                     </tbody>
                 </Table>
                 <Modal show={this.state.modal === 2 ? true : false} onHide={this.handleClose}  dialogClassName="custom-modal" style={{marginTop: "15vh"}}>
                     <Modal.Header data-testid={"close2"} closeButton>
                         <Modal.Title>
                             <div style={{display: "flex", justifyContent: "center", width:"650px", textAlign: "center", fontWeight: "bold"}}><div style={{marginLeft: "28px"}}>{this.state.modalLecture&&moment().diff(moment(this.state.modalLecture.Date), 'days') <= 1 ? "Set student attendance for lecture ":"Student attendance data for lecture "}</div></div>
                             <div style={{display: "flex", justifyContent: "center", width:"650px", textAlign: "center", fontWeight: "bold"}}><div style={{marginLeft: "28px"}}>{this.state.modalLecture?this.state.modalLecture.Name:""}</div></div></Modal.Title>
                     </Modal.Header>
                     <Modal.Body className="app-element-background">{
                         this.state.modalLecture ?
                             <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th style={{width:"17px", textAlign: "center"}}>{"No"}</th>
                                        <th style={{width:"110px", textAlign: "center"}}>Student ID</th>
                                        <th><div style={{marginLeft: "3px", marginRight: "3px"}}>Name</div></th>
                                        <th><div style={{marginLeft: "3px", marginRight: "3px"}}>Surname</div></th>
                                        <th style={{width:"117px", textAlign: "center"}}>Attendance</th>
                                    </tr>
                                </thead>
                                 <tbody data-testid={"studentsList"}>
                                     {this.state.modalLecture&&moment().diff(moment(this.state.modalLecture.Date), 'days') <= 1 ? //check if user must be able to input attendance data
                                         this.state.modalTableData.map((element, i) => {
                                             return (<tr key={i}>
                                                 <td style={{textAlign: "center"}}>{i + 1}</td>
                                                 <td style={{textAlign: "center"}}>{element.userId}</td>
                                                 <td><div style={{marginLeft: "7px", marginRight: "7px"}}>{element.name}</div></td>
                                                 <td><div style={{marginLeft: "7px", marginRight: "7px"}}>{element.surname}</div></td>
                                                 <td style={{textAlign:"center"}}>{element.attendance===1?"Yes":"No"}</td>
                                                 <td style={{margin: "auto", width:"52px"}}><Checkbox style={{ marginLeft: "7px", marginTop: "1px", height: "15px" }} disabled={element.attendance===1} checked={element.checked&&element.attendance!==1} onClick={()=>{this.setState({
                                                     modalTableData: this.state.modalTableData.map(e => {
                                                         /* istanbul ignore else */
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
                                                 <td><div style={{marginLeft: "7px", marginRight: "7px"}}>{element.name}</div></td>
                                                 <td><div style={{marginLeft: "7px", marginRight: "7px"}}>{element.surname}</div></td>
                                                 <td style={{textAlign:"center"}}>{element.attendance===1?"Yes":"No"}</td>
                                             </tr>)
                                         })}
                                 </tbody>
                             </Table> :
                             <div />}
                             {this.state.modalLecture&&moment().diff(moment(this.state.modalLecture.Date), 'days') <= 1 ?
                             <div style={{display:"flex", justifyContent:"space-between"}}>
                                 <div>
                                    <Button style={{marginRight: "10px"}} variant="danger" disabled={this.state.modalTableData.filter(e=>e.checked).length<1} onClick={(e)=>{e.preventDefault(); resetChecks(this);}}>Reset selection</Button>
                                    <Button variant="secondary" disabled={this.state.modalTableData.filter(e=>e.checked).length===this.state.modalTableData.filter(e=>e.attendance===0).length} onClick={(e)=>{e.preventDefault(); setChecks(this);}}>Select all</Button>
                                </div>
                                    <Button disabled={this.state.modalTableData.filter(e=>e.checked).length<1} onClick={(e)=>{e.preventDefault(); setPresence(this);}}>Mark as present</Button>
                             </div>
                             :<div/>}
                     </Modal.Body>
                 </Modal>
             </div>
         )
     }

     render() {

        //Expand all the accordeons with key="0" if tour is open
        let expand = this.props.tour.isTourOpen?"0":undefined

         return(
             <div className="app-background">
                <br />
                <h1 className="page-title">Student list</h1>
                <br />
                <Accordion activeKey={expand} tour-selec="programedLectures" key="programmed-lectures" style={{width: "99%", margin: "auto", marginTop: "17px"}}>
                    <Card>
                        <a href={"#"} style={{color: "black", textDecoration: "none"}}>
                            <Accordion.Toggle href={"#"} as={Card.Header} eventKey="0">
                                <h4 style={{margin: "10px", marginLeft: "2.7vw", marginBottom: "17px", marginTop: "17px"}}>Programmed lectures info</h4>
                            </Accordion.Toggle>
                        </a>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body style={{backgroundColor: "rgba(0,0,0,.03)"}}>
                                {this.renderFutureLectures()}  
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>                
                <div style={{marginBottom: "34px"}}/>  
                    <Accordion activeKey={expand} tour-selec="pastLectures" key="programmed-lectures" style={{width: "99%", margin: "auto"}}>
                        <Card>
                            <a href={"#"} style={{color: "black", textDecoration: "none"}}>
                                <Accordion.Toggle as={Card.Header} eventKey="0">
                                    <h4 style={{margin: "10px", marginLeft: "2.7vw", marginBottom: "17px", marginTop: "17px"}}>Past and current lectures attendance</h4>
                                </Accordion.Toggle>
                            </a>
                            <Accordion.Collapse eventKey="0">
                                <Card.Body style={{backgroundColor: "rgba(0,0,0,.03)"}}>
                                    {this.renderPastLectures()} 
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>
                
            </div>
         );
     }
 }


 function CustomToggle({ children, eventKey }) {
    const decoratedOnClick = useAccordionToggle(eventKey, () =>
      console.log("toggle clicked")
    );
    return (
      <button
        type="button"
        style={{ backgroundColor: "orange" }}
        onClick={decoratedOnClick}
      >
        {children}
      </button>
    );
  }