import React, { Component } from 'react'
import { getAllPosUsers, getUserBySSN, postMarkUser, getUserReport } from '../api/api'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as FileSaver from 'file-saver';
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'

export class BookingManagerReport extends Component {

    state = { posStudents: [], posTeachers: [], modal: false, searchField: "", searchedUser: "", modalResult: ""}

    componentDidMount() {

        this.updateReport()

    }

    //Update the list of positive students to show on the page
    updateReport = () => {
        getAllPosUsers()
            .then(res => {
                this.setState({ posStudents: res.data.filter(user=>user.type==="s"), posTeachers: res.data.filter(user=>user.type==="t") });
            }).catch(/* istanbul ignore next */err => {
                console.log(err);
            });
    }

    //Get report for sertain student (ssn)
    createReport = (user) => {
        getUserReport(user.ssn)
            .then(res => {
                console.log(res.data)
                //After receiving response from server we invoke the function to generate the pdf
                this.generatePDF(user, res.data)
            }).catch(/* istanbul ignore next */err => {
                console.log(err);
                //If we recive an error we generate a report saying that the student was not in contact with other students
                this.generatePDF(user,[])
            });
    }
     convertToCSV=(objArray)=> {
        let array = typeof objArray != 'object' ? JSON.parse(objArray)/* istanbul ignore else */ : objArray;
        let str = '';

        for (let i = 0; i < array.length; i++) {
            let line = '';
            for (let index in array[i]) {
                if (line != '') line += ','

                line += array[i][index];
            }

            str += line + '\r\n';
        }

        return str;
    }


     exportToCSV = (csvData, fileName) => {
            console.log("csv: "+csvData);
            csvData = csvData.map(user=>{
                return ({name: user.name, surname: user.surname, birthday: user.birthday, ssn: user.ssn, type: user.type==="s"?"student":(user.type==="t"?"teacher":"")});
            });
            const header = ["Name","Surname", "Birthday", "SSN", "Type"];
            csvData.unshift(header);
            let jsonObject = JSON.stringify(csvData);
            const csv=this.convertToCSV(jsonObject);
            console.log('csv1: '+csv);
            let blob=new Blob([csv],{type: 'text/csv;charset=utf-8;'});
            FileSaver.saveAs(blob, fileName + ".csv");
        }




    //Function to generate pdf report for certain user
    generatePDF = (user, report) => {
        // initialize jsPDF
        const doc = new jsPDF();

        // table title. and  margin-left,margin-top
        /* istanbul ignore else */
        if(user.type==="s") {
            doc.text("PULSeBS Student Report for COVID-19", 100, 16, 'center');
            doc.text("Report of COVID-19 positive for student:", 14, 32);
        }
        else if(user.type==="t") {
            doc.text("PULSeBS Teacher Report for COVID-19", 100, 16, 'center');
            doc.text("Report of COVID-19 positive for teacher:", 14, 32);           
        }
        

        // define the columns we want and their titles
        const tableColumn = ["Name", "Birthday", "SSN"];

        const tableRowUser = [[
            `${user.name} ${user.surname}`,
            user.birthday,
            user.ssn
        ]];

        doc.autoTable(tableColumn, tableRowUser, { startY: 40 });

        doc.text("Report:", 14, 72);

        console.log(report.length)
        //if the server returns empty array as a report []
        if (report.length === 0 ) {
            /* istanbul ignore else */
            if(user.type==="s") doc.text("The mentioned student was not in contact with other students. ", 14, 80);
            else if(user.type==="t") doc.text("The mentioned teacher was not in contact with any students. ", 14, 80);
         }

        else {

        // else print all the reported students in a table

            // define an empty array of rows
            const tableRowsStudents = [];
            const tableRowsTeachers = [];
            let numstudents = 0;
            // for each student pass all its data into an array
            report.forEach(user2 => {
                const userData = [
                    `${user2.name} ${user2.surname}`,
                    user2.birthday,
                    user2.ssn,
                ];
                // push each student's info into a row
                /* istanbul ignore else */
                if (user2.type==="s") { tableRowsStudents.push(userData); numstudents++; }
                else if (user2.type==="t") tableRowsTeachers.push(userData);
            });
            /* istanbul ignore else */
            if(user.type==="s") doc.text("The following students participated in the same lectures of the mentioned ", 14, 80);
            else if(user.type==="t") doc.text("The following students participated in the lectures of the mentioned ", 14, 80);
            /* istanbul ignore else */
            if(user.type==="s") doc.text("student:", 14, 88);
            else if(user.type==="t") doc.text("teacher:", 14, 88);

            // startY is basically margin-top
            doc.autoTable(tableColumn, tableRowsStudents, { startY: 96 });

            if(user.type==="s") { 
                doc.text("The mentioned student participated in the lectures of the following ", 14, 116 + 8*numstudents);
                doc.text("teachers:", 14, 124 + 8*numstudents);
                doc.autoTable(tableColumn, tableRowsTeachers, { startY:  130 + 8*numstudents});
            }
        }
        // we define the name of our PDF file.
        doc.save(`report ${user.name} ${user.surname}.pdf`);
        if (report.length > 0 ) this.exportToCSV(report,user.surname)
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
                <td style={{ display: "flex", justifyContent: "center"}}><Button style={{ marginLeft: "5px" }} data-testid={"showReport_" + k++} onClick={(e) => { e.preventDefault(); this.createReport(row) }}>Create Report</Button></td>
            </tr>)
        });

        //Return Table
        return (
            <Table striped bordered hover style={{ backgroundColor: "#fff" , width: "98%", margin: "auto"}}>
                <thead>
                    <tr>
                        <th>Full name</th>
                        <th>Date of birth</th>
                        <th style={{textAlign: "center", width: "11%"}}>Actions</th>
                    </tr>
                </thead>
                <tbody data-testid={"listTabSL"}>
                    {body}
                </tbody>
            </Table>
        )
    }

    renderPosTeachers = () => {

        //Fill the body of the table from fetched values
        let body = []
        let k = 0;
        this.state.posTeachers.forEach(row => {
            body.push(<tr key={k++}>
                <td>{row.name} {row.surname}</td>
                <td>{row.birthday?row.birthday:"/"}</td>
                {//button to generate report
                }
                <td style={{ display: "flex", justifyContent: "center" }}><Button style={{ marginLeft: "5px" }} data-testid={"showReport_" + k++} onClick={(e) => { e.preventDefault(); this.createReport(row) }}>Create Report</Button></td>
            </tr>)
        });

        //Return Table
        return (
            <Table striped bordered hover style={{ backgroundColor: "#fff" , width: "98%", margin: "auto"}}>
                <thead>
                    <tr>
                        <th>Full name</th>
                        <th>Date of birth</th>
                        <th style={{textAlign: "center", width: "11%"}}>Actions</th>
                    </tr>
                </thead>
                <tbody data-testid={"listTabTL"}>
                    {body}
                </tbody>
            </Table>
        )
    }

    //Search student by ssn
    searchBySSN = (ssn) => {
        getUserBySSN(ssn)
            .then(res => {
                this.setState({ searchedUser: res.data });
            }).catch(/* istanbul ignore next */err => {
                console.log(err)
                this.setState({ modalResult: "User not found" })
            });
    }

    markSelectedUser = (ssn) => {
        postMarkUser(ssn)
            .then(res => {
                console.log(res.data);
                // After a succesful mark, update the table
                this.updateReport()
                this.setState({ modalResult: "User added as positive." })
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
                        <th>Type</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody data-testid={"listTabSL"}>
                    <tr >
                        <td>{this.state.searchedUser.name} {this.state.searchedUser.surname}</td>
                        <td>{this.state.searchedUser.birthday?this.state.searchedUser.birthday:"/"}</td>
                        <td>{this.state.searchedUser.type==="s"?"Student":"Teacher"}</td>
                        <td style={{ display: "flex", justifyContent: "flex-start" }}><Button data-testid="confirmButton" style={{ marginLeft: "5px" }} disabled={this.state.searchedUser.covid===1?true:false} onClick={(e) => { e.preventDefault(); this.markSelectedUser(this.state.searchedUser.ssn) }}>{this.state.searchedUser.covid===1?"Marked":"Mark as positive"}</Button></td>
                    </tr>
                </tbody>
            </Table>
        )
    }

    renderModal = () => {

        return (
            <Modal data-testid="modalSSN" show={this.state.modal} onHide={() => { /* When the modal is closed clear the response message and the searched student */ this.setState({ modal: false }); this.setState({ modalResult: "" }); this.setState({ searchedUser: ""}) }}>
                <Modal.Header data-testid={"close"} closeButton>
                    <Modal.Title>Add new positive user</Modal.Title>
                </Modal.Header>
                <Modal.Body className="app-element-background">
                    <p>Search by SSN:</p>

                    <input type="text" name="fname" placeholder="SSN" onChange={(e) => { this.setState({ searchField: e.target.value }) }} />
                    <Button data-testid="search" style={{ marginLeft: "5px" }} onClick={(e) => { e.preventDefault(); this.setState({ modalResult: "" }); this.searchBySSN(this.state.searchField) }}>Search</Button>

                    <br />
                    <br />
                    {this.state.searchedUser !== "" ? this.renderModalTable() : <div></div>}
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
            <div ><br></br><h1 className="page-title">Positive users and reports</h1><br></br>
            <br/>
                <Button data-testid="addSSN" style={{ marginLeft: "1vw", marginBottom: "13px" }} onClick={(e) => { e.preventDefault(); this.setState({ modal: true }) }}>Add positive user</Button>
                <Accordion key="positive-students" style={{width: "99%", margin: "auto"}}>
                    <Card>
                        <Accordion.Toggle as={Card.Header} eventKey="0">
                            Positive students
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>
                                {this.renderPosStudents()}    
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>                    
                
                <Accordion key="positive-teachers" style={{width: "99%", margin: "auto"}}>
                    <Card>
                        <Accordion.Toggle as={Card.Header} eventKey="0">
                        Positive teachers
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>
                                {this.renderPosTeachers()}
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
                
                {this.renderModal()}
            </div>
        )
    }
}