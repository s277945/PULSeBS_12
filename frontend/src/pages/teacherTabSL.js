 import React, { Component } from 'react'
 import Table from 'react-bootstrap/Table'
 import Button from 'react-bootstrap/Button'
 import Modal from 'react-bootstrap/Modal'
 import update from './update.js'
 import { getStudentList } from '../api/api'

 export class TeacherTabSL extends Component {


     state = { tableData: [],modalTableData: [], modal: 0, element: null }

     componentDidMount() {
         update(this);
         let modal = sessionStorage.getItem("modal");//get saved modal state value
         let element = sessionStorage.getItem("element");//get saved element state value
         if(modal!==null) this.setState({ modal: parseInt(modal, 10) });
         else sessionStorage.setItem("modal", this.state.modal);//if none is present, save modal state value        
         if(JSON.parse(element)!==null) {
             this.setState({ element: JSON.parse(element) });
             this.showList(JSON.parse(element));
        }
         else sessionStorage.setItem("element", null);//if none is present, save element state value
     }


     showList = (element) => {
        getStudentList(element)
             .then(res => {
                 console.log(res)
                 this.setState({ modalTableData: res.data })
             }).catch(err=>{
                 console.log(err);
              });
        sessionStorage.setItem("element", JSON.stringify(element)); // update session data
         this.handleShow()
     }

     handleClose = () => {
         sessionStorage.removeItem("modal");         
         sessionStorage.removeItem("element");
         this.setState({ modal: 0 })
     }

     handleShow = () => {
         this.setState({ modal: 1 });
         sessionStorage.setItem("modal", 1);// update session data
     }

     render() {

         let body = []
         let k=0;
         this.state.tableData.forEach(row => {
             body.push(<tr key={k++}>
                 <td>{row.Course_Ref}</td>
                 <td>{row.Name}</td>
                 <td>{row.Date}</td>
                 <td style={{display: "flex", justifyContent: "flex-start"}}><Button style={{marginLeft: "5px"}} data-testid={"showList_"+k++} onClick={(e) => { e.preventDefault(); this.showList(row) }}>SHOW LIST</Button></td>
             </tr>)
         });

         let modalTableBody = []

         this.state.modalTableData.forEach((element,i) => {
             modalTableBody.push(<tr key={i}>
                    <td>{i+1}</td>
                    <td>{element.userId}</td>
                    <td>{element.name}</td>
                    <td>{element.surname}</td>
             </tr>)
         });


         return (
             <div  className="app-background">
                <br/>
                <h1 className="page-title">Student list</h1>
                <br/>
                 <Table striped bordered hover style={{backgroundColor: "#fff"}}>
                     <thead>
                         <tr>
                             <th>Course</th>
                             <th>Lecture name</th>
                             <th>Time and date</th>
                             <th>List of students</th>
                         </tr>
                     </thead>
                     <tbody data-testid={"listTabSL"}>
                         {body}
                     </tbody>
                 </Table>

                 <Modal show={this.state.modal===1?true:false} onHide={this.handleClose}>
                     <Modal.Header data-testid={"close"}  closeButton>
                         <Modal.Title>Students</Modal.Title>
                     </Modal.Header>
                     <Modal.Body className="app-element-background">{<Table striped bordered hover>
                     <thead>
                         <tr>
                             <th>No</th>
                             <th>Student ID</th>
                             <th>Name</th>
                             <th>Surname</th>
                         </tr>
                     </thead>
                     <tbody data-testid={"studentsList"}>
                         {modalTableBody}
                     </tbody>
                 </Table>}</Modal.Body>
                 </Modal>
             </div>
         )
     }
 }
