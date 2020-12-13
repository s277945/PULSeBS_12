import React, { useState, useEffect }  from 'react';
import Navbar  from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Table from 'react-bootstrap/Table'
import Form from 'react-bootstrap/Table'
import {useAuth} from '../components/Authsystem'
import Button from 'react-bootstrap/Button'

export default function BookingManagerHome(){

    return(
        <>
            <NavBarOfficier />
            <h2 className="ml-4 mt-3">Upload data</h2>

            <UploadComponent Name={"Student list"}/>
            <UploadComponent Name={"Professor list"}/>

        </>
    )
}

const NavBarOfficier = () => {
    const auth = useAuth();
    return(
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand>PULSeBS - System setup</Navbar.Brand>
            <Nav className="mr-auto"></Nav>
            <Nav.Link data-testid="logout" onClick={() => auth.signout()}>Logout</Nav.Link>
        </Navbar>
    )
}

const UploadComponent = ({Name}) => {
    return(
        <div className="d-flex justify-content-center mt-5">
            <Table className="w-75 table-bordered">
            <thead>
            <tr>
                <th>{Name}</th>
                <th>Last Update</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>Student.csv</td>
                <td>2020-09 14:05</td>
                <td><UploadFileButton /></td>
            </tr>
            </tbody>
        </Table>
      </div>
    )
}


const UploadFileButton = () => 
    <Form>
    {/* <Form.File 
        id="custom-file"
        label="Custom file input"
        custom
    /> */}
    </Form>