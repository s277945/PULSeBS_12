import React, { Component } from 'react'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import update from './update.js'


export class TeacherTabLec extends Component {


    state = { tableData: [], modalShow: 0, selectedLec: {} }

    componentDidMount() {
        update(this);
    }

    showModifications = (element) => {

        this.setState({ selectedLec: element })

        this.handleShow()
    }

    handleClose = () => {
        this.setState({ modalShow: 0 })
    }

    handleShow = () => {
        this.setState({ modalShow: 1 })
    }

    render() {

        let tableBody = []

        this.state.tableData.forEach(element => {
            tableBody.push(<tr>
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