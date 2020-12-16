import React, { useState, useEffect }  from 'react';
import Table from 'react-bootstrap/Table'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import bsCustomFileInput from 'bs-custom-file-input'
import {uploadStudents, uploadTeachers, uploadCourses, uploadEnrollment, uploadSchedule, getFileData} from '../api/api';
import { toast } from 'react-toastify';
import Spinner  from 'react-bootstrap/Spinner'

export default function SystemSetupView() {
    const [uploaded, setUploaded] = useState([0,0,0,0,0]);
    useEffect(() => {
        getFileData().then(response => {
            let newuploaded=[];
            if(response.data) {
                let studentsFile=response.data.filter(f=>f.fileType===0);
                let professorsFile=response.data.filter(f=>f.fileType===1);
                let coursesFile=response.data.filter(f=>f.fileType===2);
                let enrollmentFile=response.data.filter(f=>f.fileType===3);
                let scheduleFile=response.data.filter(f=>f.fileType===4);
                if(studentsFile.length>0) newuploaded.push(studentsFile[0])
                else newuploaded.push({fileType: null, fileName: null, fileDate: null})
                if(professorsFile.length>0) newuploaded.push(professorsFile[0])
                else newuploaded.push({fileType: null, fileName: null, fileDate: null})
                if(coursesFile.length>0) newuploaded.push(coursesFile[0])
                else newuploaded.push({fileType: null, fileName: null, fileDate: null})
                if(enrollmentFile.length>0) newuploaded.push(enrollmentFile[0])
                else newuploaded.push({fileType: null, fileName: null, fileDate: null})
                if(scheduleFile.length>0) newuploaded.push(scheduleFile[0])
                else newuploaded.push({fileType: null, fileName: null, fileDate: null})
            }
            console.log(response);
            setUploaded(newuploaded);
        })
        .catch(/* istanbul ignore next */err => {
            console.log(err);
        })
    }, []);
    return(
        <div style={{minWidth: "1000px"}}>
            <br/>
            <h2 className="page-title">Upload data</h2>
            <UploadComponent filename={uploaded[0].fileName} filedate={uploaded[0].fileDate} Name={"Student list"} listType="student"/>
            <UploadComponent filename={uploaded[1].fileName} filedate={uploaded[1].fileDate} Name={"Professor list"} listType="professor"/>
            <UploadComponent filename={uploaded[2].fileName} filedate={uploaded[2].fileDate} Name={"Course list"} listType="course"/>
            <UploadComponent filename={uploaded[3].fileName} filedate={uploaded[3].fileDate} Name={"Enrollment list"} listType="enrollment"/>
            <UploadComponent filename={uploaded[4].fileName} filedate={uploaded[4].fileDate} Name={"Schedule list"} listType="schedule"/>
        </div>
    )
}

const UploadComponent = ({filename, filedate, Name, listType}) => {
    
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
                <td>{filename?filename:"/"}</td>
                <td>{filedate?filedate:"/"}</td>
                <td style={{width: "35vw"}}><UploadFileButton Name={Name} listType={listType}/></td>
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
        console.log(file);
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
            let datalength=data.length;// init data lenght variable
            let lbuffer=0;// init current data lenght counter
            let index=0;// init array index
            let datasentlength=[];// init progress values array
            const requests = []
            while(data.length){
                const elems = data.splice(0, 200);                
                lbuffer+=elems.length;
                datasentlength.push(lbuffer);// set upload percentage values
                requests.push(() => {
                    return apiCall(elems, )
                })
            }
            let br=false;
            Promise.all(requests.map(fn => {
                return new Promise((resolve, reject) => {// return a promise
                    fn()
                        .then((response)=>{
                            setPercentage(Math.round((datasentlength[index++]/datalength)*100));// update upload percentage value
                            resolve(response);// resolve if all is good
                        })
                        .catch(err=>{reject(err)})// else reject
            })}))
            .then(response => {
                toast.info(Name + " correctly uploaded")
                setUploading(false);
                setPercentage(0);// reset percentage
            })
            .catch(e => {
                console.log(e);
                if(typeof(e.response)==="undefined") toast.error("Server error: error sending data to server");
                else if(e.response.status===500){// check error response status
                    if(e.response.data.errno===19) toast.error("Server error: database constraint violation")// check for sql contraint violation
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
    <div style={{display: "flex", wrap: "nowrap"}}>
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
        <Button disabled={uploading} className="ml-3" variant="primary" onClick={() => sendFile()} style={{height: "38px"}}>
            {!uploading && <div>Send</div>}
            {uploading && <div style={{minWidth: "105px"}}><Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" style={{marginRight: "5px", marginBottom: "1.5px"}}/>Uploading...</div>}
        </Button>
            {uploading?<h3 style={{marginTop: "0px", marginLeft: "10px", color: "grey"}}>{percentage}%</h3>:<div/>}
    </div>
    )
}