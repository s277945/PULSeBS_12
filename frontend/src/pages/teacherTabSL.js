import React, { Component } from 'react'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

export class TeacherTabSL extends Component {


    state = { table: [], modal: 0 }

    componentDidMount() {
        //Todo: check if session is stared, otherwise return to login
        this.update()
    }

    update = () => {
        //todo: get teacher lectures from backend
        let dummyData = [["Lecture1", "Time1", "Number1"], ["Lecture2", "Time2", "Number2"], ["Lecture3", "Time3", "Number3"]]

        this.setState({ table: dummyData })
    }

    showList = (element) => {
        //todo: axios get students for given lecture
        this.handleShow()
    }

    handleClose = () => {
        this.setState({modal: 0})
    }

    handleShow = () => {
        this.setState({modal: 1})
        console.log(this.state.modal)
    }

    render() {

        let tableBody = []

        this.state.table.forEach(element => {
            tableBody.push(<tr>
                <td>{element[0]}</td>
                <td>{element[1]}</td>
                <td>{element[2]}</td>
                <td><Button onClick={(e) =>{ e.preventDefault(); this.showList(element)}}>SHOW LIST</Button></td>
            </tr>)
        });

        return (
            <div><p>Students List tab</p>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Lecture</th>
                            <th>Time and date</th>
                            <th>Number of Bookings</th>
                            <th>List of students</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableBody}
                    </tbody>
                </Table>

                <Modal show={this.state.modal} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Students</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Studnets List here</Modal.Body>
                </Modal>
            </div>
        )
    }
}