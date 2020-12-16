import React, { Component } from 'react'
import { getAllPosStudents, getStudentBySSN, postMarkStudent, getStudentReport } from '../api/api'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

import jsPDF from "jspdf";
import "jspdf-autotable";


export class BookingManagerReport extends Component {

    state = { posStudents: [], modal: false, searchField: "", searchedStudent: "", modalResult: ""}

    componentDidMount() {

        this.updateReport()

    }

    //Update the list of positive students to show on the page
    updateReport = () => {
        getAllPosStudents()
            .then(res => {
                this.setState({ posStudents: res.data });
            }).catch(/* istanbul ignore next */err => {
                console.log(err);
            });
    }

    //Get report for sertain student (ssn)
    createReport = (student) => {
        getStudentReport(student.ssn)
            .then(res => {
                console.log(res.data)
                //After receiving response from server we invoke the function to generate the pdf
                this.generatePDF(student, res.data)
            }).catch(/* istanbul ignore next */err => {
                console.log(err);
                //If we recive an error we generate a report saying that the student was not in contact with other students
                this.generatePDF(student,[])
            });
    }

    //Function to generate pdf report for certain student
    generatePDF = (student, report) => {
        // initialize jsPDF
        const doc = new jsPDF();

        // table title. and  margin-left,margin-top
        doc.text("PULSeBS Student Report for COVID-19", 100, 16, 'center');
        doc.text("Report of COVID-19 positive for student:", 14, 32);

        // define the columns we want and their titles
        const tableColumn = ["Name", "Birthday", "SSN"];

        const tableRowStudent = [[
            `${student.name} ${student.surname}`,
            student.birthday,
            student.ssn
        ]];

        doc.autoTable(tableColumn, tableRowStudent, { startY: 40 });

        doc.text("Report:", 14, 64);

        //if the server returns empty array as a report []
        if (report.length === 0 ) {

            doc.text("The mentioned student was not in contact with other students. ", 14, 72);
         }

        else {

        // else print all the reported students in a table

            // define an empty array of rows
            const tableRows = [];

            // for each student pass all its data into an array
            report.forEach(student => {
                const studentData = [
                    `${student.name} ${student.surname}`,
                    student.birthday,
                    student.ssn,
                ];
                // push each student's info into a row
                tableRows.push(studentData);
            });

            doc.text("The following students participated in the same lectures of the mentioned ", 14, 72);

            doc.text("student:", 14, 80);

            // startY is basically margin-top
            doc.autoTable(tableColumn, tableRows, { startY: 88 });

        }

        // we define the name of our PDF file.
        doc.save(`report ${student.name} ${student.surname}.pdf`);

    }

    //Render list of positive students
    renderPosStudents = () => {

        //Fill the body of the table from fetched values
        let body = []
        let k = 0;
        this.state.posStudents.forEach(row => {
            body.push(<tr key={k++}>
                <td>{row.name} {row.surname}</td>
                <td>{row.birthday}</td>
                {//button to generate report
                }
                <td style={{ display: "flex", justifyContent: "flex-start" }}><Button style={{ marginLeft: "5px" }} data-testid={"showReport_" + k++} onClick={(e) => { e.preventDefault(); this.createReport(row) }}>Create Report</Button></td>
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

    //Search student by ssn
    searchBySSN = (ssn) => {
        getStudentBySSN(ssn)
            .then(res => {
                this.setState({ searchedStudent: res.data });
            }).catch(/* istanbul ignore next */err => {
                console.log(err)
                this.setState({ modalResult: "Student not found" })
            });
    }

    markSelectedStudent = (ssn) => {
        postMarkStudent(ssn)
            .then(res => {
                console.log(res.data);
                // After a succesful mark, update the table
                this.updateReport()
                this.setState({ modalResult: "Student added as positive." })
                //update searched student, to get covid flag as 1 and disable the button
                this.searchBySSN(ssn)
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
                        <td style={{ display: "flex", justifyContent: "flex-start" }}><Button data-testid="confirmButton" style={{ marginLeft: "5px" }} disabled={this.state.searchedStudent.covid===1?true:false} onClick={(e) => { e.preventDefault(); this.markSelectedStudent(this.state.searchedStudent.ssn) }}>{this.state.searchedStudent.covid===1?"Marked":"Mark as positive"}</Button></td>
                    </tr>
                </tbody>
            </Table>
        )
    }

    rednerModal = () => {

        return (
            <Modal data-testid="modalSSN" show={this.state.modal} onHide={() => { /* When the modal is closed clear the response message and the searched student */ this.setState({ modal: false }); this.setState({ modalResult: "" }); this.setState({ searchedStudent: ""}) }}>
                <Modal.Header data-testid={"close"} closeButton>
                    <Modal.Title>Add new positive student</Modal.Title>
                </Modal.Header>
                <Modal.Body className="app-element-background">
                    <p>Search by SSN:</p>

                    <input type="text" name="fname" placeholder="SSN" onChange={(e) => { this.setState({ searchField: e.target.value }) }} />
                    <Button data-testid="search" style={{ marginLeft: "5px" }} onClick={(e) => { e.preventDefault(); this.setState({ modalResult: "" }); this.searchBySSN(this.state.searchField) }}>Search</Button>

                    <br />
                    <br />
                    {this.state.searchedStudent !== "" ? this.renderModalTable() : <div></div>}
                    <br />
                    {
                        //This state is to show the result of the mark student as positive api. If succesful show the message, also show when student is not found. We deactivate the message when the modal closes or when a new search is performed.
                        this.state.modalResult !== "" ? this.state.modalResult : <div></div>}
                </Modal.Body>
            </Modal>
        )
    }

    render() {

        return (
            <div ><br></br><h1 className="page-title">Positive students and reports</h1><br></br>

                <Button data-testid="addSSN" style={{ marginLeft: "5px" }} onClick={(e) => { e.preventDefault(); this.setState({ modal: true }) }}>Add New Student</Button>

                <br/>
                <br/>

                {this.renderPosStudents()}

                {this.rednerModal()}
            </div>
        )
    }
}