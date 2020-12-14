import React, { useState, useEffect }  from 'react';
import Navbar  from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Table from 'react-bootstrap/Table'
import Form from 'react-bootstrap/Form'
import {useAuth} from '../components/Authsystem'
import Button from 'react-bootstrap/Button'
import bsCustomFileInput from 'bs-custom-file-input'
import {uploadStudents, uploadTeachers, uploadCourses, uploadEnrollment, uploadSchedule} from '../api/api';
import { toast } from 'react-toastify';

export default function BookingManagerHome(){

    return(
        <>
            <NavBarOfficier />
            <h2 className="ml-4 mt-3">Upload data</h2>

            <UploadComponent Name={"Student list"} listType="student"/>
            <UploadComponent Name={"Professor list"} listType="professor"/>
            <UploadComponent Name={"Course list"} listType="course"/>
            <UploadComponent Name={"Enrollment list"} listType="enrollment"/>
            <UploadComponent Name={"Schedule list"} listType="schedule"/>

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

const UploadComponent = ({Name, listType}) => {
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
                <td><UploadFileButton Name={Name} listType={listType}/></td>
            </tr>
            </tbody>
        </Table>
      </div>
    )
}

const UploadFileButton = ({Name, listType}) => {
    const [files, setFiles] = useState();

    useEffect(() => {
        bsCustomFileInput.init();
    });

    const sendFile = () => {
        let file = files[0];
        if(!file) return;

        const reader = new FileReader();

        reader.onload = e => {
            let contents = e.target.result;
      
            contents = contents.split('\n')

            // TODO : REMOVE ME
            contents.splice(5)

            // Find headers by list type
            let headers;
            let apiCall;
            switch(listType){
                case "student":
                    apiCall = uploadStudents
                    headers = "userID,Name,Surname,City,email,birthday,ssn".split(',')
                break; 
                case "professor":
                    apiCall = uploadTeachers
                    headers = "userID,Name,Surname,City,email,birthday,ssn".split(',')

                case "course":
                    apiCall = uploadCourses
                    headers = "courseId,year,name,semester,teacherId".split(',')
                break; 
                case "enrollment":
                    apiCall = uploadEnrollment
                    headers = "courseId,studentId".split(',')
                break; 
                case "schedule":
                    apiCall = uploadSchedule
                    headers = "courseId, room, day, seats, time".split(',')
                break; 
            }

            // Create an array 
            contents.shift()
            const data = contents.map((line, index) => {
                const res = {}

                // clean \r or other unwanted symbol
                line = line.replace(/\n|\r/g, "");
                const values = line.split(",")
                values.map((val, index2) => {
                    const header = headers[index2] 
                    const tmp = {[header]: val}
                    Object.assign(res, tmp)
                })

                return res
            })


            apiCall(data).then(response => {
                toast.info(Name + " correctly uploaded")
            })
            .catch(e => {
                toast.error("Error sending data to server")
            })
        };

        reader.readAsText(file);
    }

    return(
    <Form>
        <div className="d-flex">
            <Form.File 
                id="custom-file"
                label= {Name + " csv list file"}
                custom
                onChange={(event) => setFiles(event.target.files)}
            />
            <Button className="ml-1" variant="primary" onClick={() => sendFile()}>Send</Button>
        </div>
    </Form>
    )
}


