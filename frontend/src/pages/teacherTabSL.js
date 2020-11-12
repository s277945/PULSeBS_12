import React, { Component } from 'react'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import axios from 'axios';
import userIdentity from '../api/userIdentity.js'

export class TeacherTabSL extends Component {


    state = { tableData: [],modalTableData: [], modalShow: 0 }

    componentDidMount() {
        this.update()
    }

    update = () => {

        let lecList = []
        axios.get(`http://localhost:3001/api/lectures`, { withCredentials: true, credentials: 'include' })
            .then(res => {
                console.log(res.data)
                lecList = res.data
                console.log(lecList)
                this.setState({ tableData: lecList })

            }).catch(err=>{ 
                userIdentity.removeUserSession(this.props.context);
                this.props.history.push("/");
                console.log(err);
             });

    }

    showList = (element) => {
        //todo: axios get students for given lecture
        console.log("Getting data")
        //todo: get teacher lectures from backend
        let lecList = []
        axios.get(`http://localhost:3001/api/lectures/listStudents?courseRef=${element.Course_Ref}&date=${element.Date}`,{ withCredentials: true, credentials: 'include' })
            .then(res => {
                //res.data.map((obj) => reqList.push(obj.RequestType))
                console.log(res)
                this.setState({ modalTableData: res.data })
            }).catch(err=>{ 
                userIdentity.removeUserSession(this.props.context);
                this.props.history.push("/");
                console.log(err);
             });
        this.handleShow()
    }

    handleClose = () => {
        this.setState({ modalShow: 0 })
    }

    handleShow = () => {
        this.setState({ modalShow: 1 })
        console.log(this.state.modalShow)
    }

    render() {

        let tableBody = []

        this.state.tableData.forEach(element => {
            tableBody.push(<tr>
                <td>{element.Course_Ref}</td>
                <td>{element.Name}</td>
                <td>{element.Date}</td>
                <td><Button onClick={(e) => { e.preventDefault(); this.showList(element) }}>SHOW LIST</Button></td>
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

                <Modal show={this.state.modalShow} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Students</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{<Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Student Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {modalTableBody}
                    </tbody>
                </Table>}</Modal.Body>
                </Modal>
            </div>
        )
    }
}