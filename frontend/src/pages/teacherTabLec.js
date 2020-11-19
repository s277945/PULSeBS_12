import React, { Component } from 'react'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import update from './update.js'
import {authContext} from '../components/Authsystem'


export class TeacherTabLec extends Component {
    static contextType = authContext


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

    render() {

        let tableBody = []
        let k=0;
        this.state.tableData.forEach(element => {
            tableBody.push(<tr key={k++}>
                <td>{element.Course_Ref}</td>
                <td>{element.Name}</td>
                <td>{element.Date}</td>
                <td><Button onClick={(e) => { e.preventDefault(); this.showModifications(element) }}>SELECT</Button></td>
            </tr>)
        });

        return (
            <div><br/>
                <Table striped bordered hover style={{backgroundColor: "#fff"}}>
                    <thead>
                        <tr>
                            <th>Lecture</th>
                            <th>Lecture name</th>
                            <th>Time and date</th>
                            <th>Modifications</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableBody}
                    </tbody>
                </Table>

                <Modal show={this.state.modalShow} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.state.selectedLec.Name}<p style={{fontWeight:'normal'}}>{this.state.selectedLec.Date}</p></Modal.Title>
                    </Modal.Header>
                    <Modal.Body class="app-element-background"><Table striped bordered hover>
                    <Button variant="danger" style={{margin: "20px"}} onClick={(e) => { e.preventDefault();  }}>CANCEL LECTURE</Button>
                    <Button style={{margin: "10px"}} onClick={(e) => { e.preventDefault();  }}>TURN INTO DISTANCE LECTURE</Button>
                    </Table>
                    </Modal.Body>
                </Modal>
            </div>
        )
    }
}