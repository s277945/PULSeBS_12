 import React, { Component } from 'react'
 import Table from 'react-bootstrap/Table'
 import Button from 'react-bootstrap/Button'
 import Modal from 'react-bootstrap/Modal'
 import update from './update.js'
 import { getStudentList } from '../api/api'

 export class TeacherTabSL extends Component {


     state = { tableData: [],modalTableData: [], modal: 0 }

     componentDidMount() {
         update(this);
     }


     showList = (element) => {
        getStudentList(element)
             .then(res => {
                 console.log(res)
                 this.setState({ modalTableData: res.data })
             }).catch(err=>{
                 console.log(err);
              });
         this.handleShow()
     }

     handleClose = () => {
         this.setState({ modal: 0 })
     }

     handleShow = () => {
         this.setState({ modal: 1 })
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
             modalTableBody.push(<tr>
                 <td>{i+1}</td>
                 <td>{element}</td>
             </tr>)
         });


         return (
             <div  class="app-background">
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

                 <Modal show={this.state.modal} onHide={this.handleClose}>
                     <Modal.Header data-testid={"close"}  closeButton>
                         <Modal.Title>Students</Modal.Title>
                     </Modal.Header>
                     <Modal.Body class="app-element-background">{<Table striped bordered hover>
                     <thead>
                         <tr>
                             <th>No</th>
                             <th>Student Name</th>
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
