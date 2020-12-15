import React, { useState, useEffect }  from 'react';
import Table from 'react-bootstrap/Table'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import bsCustomFileInput from 'bs-custom-file-input'
import {uploadStudents, uploadTeachers, uploadCourses, uploadEnrollment, uploadSchedule} from '../api/api';
import { toast } from 'react-toastify';
import Spinner  from 'react-bootstrap/Spinner'

export default function SystemSetupView() {
    return(
        <div style={{minWidth: "1000px"}}>
            <br/>
            <h2 className="page-title">Upload data</h2>

            <UploadComponent Name={"Student list"} listType="student"/>
            <UploadComponent Name={"Professor list"} listType="professor"/>
            <UploadComponent Name={"Course list"} listType="course"/>
            <UploadComponent Name={"Enrollment list"} listType="enrollment"/>
            <UploadComponent Name={"Schedule list"} listType="schedule"/>
        </div>
    )
}

const UploadComponent = ({Name, listType}) => {
    return(
        <div className="d-flex justify-content-center mt-5">
            <Table className="w-75 table-bordered">
            <thead>
            <tr>
                <th style={{width: "25vw"}}>{Name}</th>
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
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [ percentage, setPercentage] = useState(0);

    useEffect(() => {
        bsCustomFileInput.init();
    });

    const sendFile = () => {
        let file = files[0];
        if(!file) return;

        setUploading(true)

        const reader = new FileReader();

        reader.onload = e => {
            let contents = e.target.result;
      
            contents = contents.split('\n')

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
                    headers = "userID,Name,Surname,email,ssn".split(',')
                break;
                case "course":
                    apiCall = uploadCourses
                    headers = "courseId,year,semester,name,teacherId".split(',')
                break; 
                case "enrollment":
                    apiCall = uploadEnrollment
                    headers = "courseId,studentId".split(',')
                break; 
                case "schedule":
                    apiCall = uploadSchedule
                    headers = "courseId,room,day,seats,time".split(',')
                break; 
                default :
                    console.error("Incorrect list type")
                break;
            }

            // Create data table (remove first elem bcs it's the the csv headers)
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
            let datalength=data.length;
            let lbuffer=0;
            let index=0;
            let datasentlength=[];
            const requests = []
            while(data.length){
                const elems = data.splice(0, 200);                
                lbuffer+=elems.length;
                datasentlength.push(lbuffer);// set upload percentage values
                requests.push(() => {
                    return apiCall(elems)
                })
            }
            let br=false;
            Promise.all(requests.map(fn => {
                return new Promise((resolve, reject) => {
                    fn()
                        .then((response)=>{
                            setPercentage(Math.round((datasentlength[index++]/datalength)*100));// update upload percentage value
                            resolve(response);
                        })
                        .catch(err=>{reject(err)})
            })}))
            .then(response => {
                toast.info(Name + " correctly uploaded")
                setUploading(false)
            })
            .catch(e => {
                console.log(e);
                if(e.response.status===500){
                    if(e.response.data.errno===19) toast.error("Server error: database constraint violation")
                    else toast.error("Server error: error sending data to server")
                }
                /*else{
                    toast.error("Error sending data to server")
                }*/
                setUploading(false)
            })
        };

        reader.readAsText(file);
    }

    return(
    <div className="d-flex">
        <Form>
            <div className="d-flex">
                <Form.File 
                    id="custom-file"
                    label= {Name + " csv list file"}
                    custom
                    onChange={(event) => setFiles(event.target.files)}
                />
            </div>
        </Form>
        <Button disabled={uploading} className="ml-3" variant="primary" onClick={() => sendFile()}>
            {!uploading && <div>Send</div>}
            {uploading && <div><Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" style={{marginRight: "5px"}}/>Uploading...</div>}
        </Button>
            {uploading?<h3 style={{marginLeft: "10px", color: "grey"}}>{percentage}%</h3>:<div/>}
    </div>
    )
}