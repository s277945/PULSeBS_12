import React, { Component } from 'react'
import { getAllPosStudents, getStudentBySSN, postMarkStudent } from '../api/api'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'


export class BookingManagerReport extends Component {

    state = { posStudents: [], modal: false, searchField: "", searchedStudent: "", modalResult:"" }

    componentDidMount() {

        this.updateReport()

    }

    updateReport = () => {
        getAllPosStudents()
            .then(res => {
                this.setState({ posStudents: res.data });
            }).catch(/* istanbul ignore next */err => {
                console.log(err);
            });
    }

    createReport = () => { }

    renderPosStudents = () => {

        //Fill the body of the table from fetched values
        let body = []
        let k = 0;
        this.state.posStudents.forEach(row => {
            body.push(<tr key={k++}>
                <td>{row.name} {row.surname}</td>
                <td>{row.birthday}</td>
                <td style={{ display: "flex", justifyContent: "flex-start" }}><Button style={{ marginLeft: "5px" }} data-testid={"showReport_" + k++} onClick={(e) => { e.preventDefault(); this.createReport(row.ssn) }}>Create Report</Button></td>
            </tr>)
        });

        //Return Table
        return (
            <Table striped bordered hover style={{ backgroundColor: "#fff" }}>
                <thead>
                    <tr>
                        <th>Name Surname</th>
                        <th>Date of birth</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody data-testid={"listTabSL"}>
                    {body}
                </tbody>
            </Table>
        )
    }

    searchBySSN = () => {
        getStudentBySSN(this.state.searchField)
            .then(res => {
                this.setState({ searchedStudent: res.data });
            }).catch(/* istanbul ignore next */err => {
                console.log(err);
            });
    }

    markSelectedStudent = (ssn) => {
        postMarkStudent(ssn)
            .then(res => {
                console.log(res.data);
                // After a succesful mark, update the table
                this.updateReport()
                this.setState({modalResult: "Student added as positive."})
            }).catch(/* istanbul ignore next */err => {
                console.log(err);
            });
    }

    renderModalTable = () => {
        return (
            <Table striped bordered hover style={{ backgroundColor: "#fff" }}>
                <thead>
                    <tr>
                        <th>Name Surname</th>
                        <th>Date of birth</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody data-testid={"listTabSL"}>
                    <tr >
                        <td>{this.state.searchedStudent.name} {this.state.searchedStudent.surname}</td>
                        <td>{this.state.searchedStudent.birthday}</td>
                        <td style={{ display: "flex", justifyContent: "flex-start" }}><Button style={{ marginLeft: "5px" }} onClick={(e) => { e.preventDefault(); this.markSelectedStudent(this.state.searchedStudent.ssn) }}>Mark as Positive</Button></td>
                    </tr>
                </tbody>
            </Table>
        )
    }

    rednerModal = () => {

        return (
            <Modal show={this.state.modal} onHide={() => { this.setState({ modal: false });this.setState({ modalResult: "" }) }}>
                <Modal.Header data-testid={"close"} closeButton>
                    <Modal.Title>Add new positive student</Modal.Title>
                </Modal.Header>
                <Modal.Body className="app-element-background">
                    <p>Search by SSN:</p>
                    <input type="text" name="fname" placeholder="SSN" onChange={(e) => { this.setState({ searchField: e.target.value }) }} />
                    <Button style={{ marginLeft: "5px" }} onClick={(e) => { e.preventDefault();this.setState({ modalResult: "" }); this.searchBySSN() }}>Search</Button>
                    <br />
                    {this.state.searchedStudent !== "" ? this.renderModalTable() : <div></div>}
                    <br/>
                    {
                    //This state is to show the result of the mark api. If succesful show the message. We deactivate the message when the modal closes or when a new search is performed.
                    this.state.modalResult !== "" ? this.state.modalResult : <div></div>}
                </Modal.Body>
            </Modal>
        )
    }

    render() {

        return (
            <div ><br></br><h1 className="page-title">Positive students and reports</h1><br></br>

                <Button style={{ marginLeft: "5px" }} onClick={(e) => { e.preventDefault(); this.setState({ modal: true }) }}>Add New Student</Button>

                <br></br>

                {this.renderPosStudents()}

                {this.rednerModal()}
            </div>
        )
    }
}