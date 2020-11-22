import React, { Component } from 'react'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import update from './update.js'
import { cancelLecture } from '../api/api'


export class TeacherTabLec extends Component {


    state = { tableData: [], modalShow: false, selectedLec: {} }

    componentDidMount() {
        update(this);
    }

    showModifications = (element) => {

        this.setState({ selectedLec: element })

        this.handleShow()
    }

    handleClose = () => {
        this.setState({ modalShow: false })
    }

    handleShow = () => {
        this.setState({ modalShow: true })
    }

    handleCancel = (e) => {
        e.preventDefault();
        cancelLecture(this.state.selectedLec.Course_Ref, this.state.selectedLec.Date)
            .then(response=> {
                this.setState({ modalShow: false })
            })
            .catch(err => {
                console.log(err);
            });
        let newTable = this.state.tableData.filter(element=>{return element.Course_Ref!==this.state.selectedLec.Course_Ref || (element.Course_Ref===this.state.selectedLec.Course_Ref&&element.Date!==this.state.selectedLec.Date)});
        this.setState({ tableData: newTable});
    }
    render() {

        let tableBody = []
        let k=0;
        this.state.tableData.forEach(element => {
            tableBody.push(<tr key={k++}>
                <td>{element.Course_Ref}</td>
                <td>{element.Name}</td>
                <td>{element.Date}</td>
                <td style={{display: "flex", justifyContent: "flex-start"}}><Button style={{marginLeft: "15px"}} data-testid={"showCourse_"+k++} onClick={(e) => { e.preventDefault(); this.showModifications(element) }}>SELECT</Button></td>
            </tr>)
        });

        return (
            <div>
                <br/>
                <h1 className="page-title">Lectures</h1>
                <br/>
                <Table striped bordered hover style={{backgroundColor: "#fff"}}>
                    <thead>
                        <tr>
                            <th>Course</th>
                            <th>Lecture name</th>
                            <th>Time and date</th>
                            <th>Modifications</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableBody}
                    </tbody>
                </Table>

                <Modal show={this.state.modalShow} onHide={this.handleClose} style={{marginTop: "17vh"}}>
                    <Modal.Header style={{flexWrap: "no-wrap"}} data-testid={"close"} closeButton>
                        <div>
                            <Modal.Title style={{marginLeft: "37px", marginTop: "13px"}}><div><p style={{fontWeight:'bold', display: "inline"}}>Lecture:  </p><p style={{display: "inline", marginLeft: "10px"}}>{this.state.selectedLec.Name}</p></div><div><p style={{fontWeight:'bold', display: "inline"}}>Date: </p><p style={{display: "inline", marginLeft: "10px"}}>{this.state.selectedLec.Date}</p></div></Modal.Title>
                            <div style={{display: "flex", flexWrap: "no-wrap", justifyContent: "flex-end", marginTop: "27px"}}>
                                <Button variant="danger" style={{marginLeft: "27px", marginTop: "17px", marginBottom: "17px", paddingLeft: "9px", paddingRight: "9px" }} onClick={(e) => { this.handleCancel(e)  }}>CANCEL LECTURE</Button>
                                <Button variant="info" style={{marginLeft: "17px", marginTop: "17px", marginBottom: "17px", paddingLeft: "9px", paddingRight: "9px" }} onClick={(e) => { e.preventDefault();  }}>TURN INTO DISTANCE LECTURE</Button>
                            </div>
                        </div>
                    </Modal.Header>
                </Modal>
            </div>
        )
    }
}
