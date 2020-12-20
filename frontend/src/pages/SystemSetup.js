import React, { useState, useEffect }  from 'react';
import Table from 'react-bootstrap/Table'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import bsCustomFileInput from 'bs-custom-file-input'
import {uploadStudents, uploadTeachers, uploadCourses, uploadEnrollment, uploadSchedule, getFileData} from '../api/api';
import { toast } from 'react-toastify';
import Spinner  from 'react-bootstrap/Spinner'
import moment from 'moment';
import { MdErrorOutline } from "react-icons/md";

export default function SystemSetup() {
    const [uploaded, setUploaded] = useState([0,0,0,0,0]);
    useEffect(() => {
        getFileData().then(response => {
            if(response.data) {console.log(response.data);
            setUploaded(response.data);
            }
            /* istanbul ignore else */
            
        })
        .catch(/* istanbul ignore next */err => {
            console.log(err);
        })
    }, []);
    return(
        <div style={{minWidth: "1000px"}}>
            <br/>
            <h2 className="page-title">Upload data</h2>
            <UploadComponent uploaded={uploaded} setUploaded={setUploaded} filename={uploaded[0].fileName} filedate={uploaded[0].lastUpdate} key={0} type={0} Name={"Student list"} listType="student"/>
            <UploadComponent uploaded={uploaded} setUploaded={setUploaded} filename={uploaded[1].fileName} filedate={uploaded[1].lastUpdate} key={1} type={1} Name={"Professor list"} listType="professor"/>
            <UploadComponent uploaded={uploaded} setUploaded={setUploaded} filename={uploaded[2].fileName} filedate={uploaded[2].lastUpdate} key={2} type={2} Name={"Course list"} listType="course"/>
            <UploadComponent uploaded={uploaded} setUploaded={setUploaded} filename={uploaded[3].fileName} filedate={uploaded[3].lastUpdate} key={3} type={3} Name={"Enrollment list"} listType="enrollment"/>
            <UploadComponent uploaded={uploaded} setUploaded={setUploaded} filename={uploaded[4].fileName} filedate={uploaded[4].lastUpdate} key={4} type={4} Name={"Schedule list"} listType="schedule"/>
        </div>
    )
}

const UploadComponent = ({uploaded, setUploaded, filename, filedate, type, Name, listType}) => {
    const checkDisabled = () => {// check if there are missing file dependencies
        if(type===4&&(!uploaded[2].fileName||uploaded[2].fileName==="/"||(typeof uploaded[2].fileName==="undefined"))) return true;
        else if(type===3&&(!uploaded[2].fileName||!uploaded[0].fileName||uploaded[2].fileName==="/"||uploaded[0].fileName==="/"||(typeof uploaded[2].fileName==="undefined")||(typeof uploaded[0].fileName==="undefined"))) return true;
        else return false;
    }
    return(
        <div className="d-flex justify-content-center mt-5">
            <Table className="w-75 table-bordered" style={{background: "white"}}>
            <thead>
            <tr>
                <th style={{width: "25vw"}}>{Name}</th>
                <th>Last Update</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td><div className="d-flex mt-1" style={{minWidth: "120px"}}>{filename?filename:"/"}</div></td>
                <td><div className="d-flex mt-1" style={{minWidth: "120px"}}>{(filedate&&filedate!=="/")?moment(filedate).format("DD/MM/YYYY HH:mm"):"/"}</div></td>
                <td style={{width: "35vw"}}><UploadFileButton disabled={checkDisabled()} uploaded={uploaded} setUploaded={setUploaded} Name={Name} listType={listType} type={type}/></td>
            </tr>
            </tbody>
        </Table>
      </div>
    )
}

const UploadFileButton = ({disabled, uploaded, setUploaded, Name, listType, type}) => {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [percentage, setPercentage] = useState(0);

    useEffect(() => {
        bsCustomFileInput.init();
    });

    const sendFile = () => {
        let file = files[0];
        if(!file) return;
        /* istanbul ignore else */
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
                /* istanbul ignore next */
                default :
                    console.error("Incorrect list type")
                break;
            }

            // Create data table (remove first elem bcs it's the the csv headers)
            contents.shift()
            const data = contents.map((line) => {
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
                    return apiCall(elems, file.name)
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
                let newuploaded = uploaded.map(e1=>e1);
                newuploaded[type]={fileName: file.name, fileType: type, lastUpdate: moment()}
                setUploaded(newuploaded);
                setFiles([]);
            })
            .catch(/* istanbul ignore next */err1 => {
                console.log(err1);
                if(typeof(err1.response)==="undefined") toast.error("Server error: error sending data to server");
                else if(err1.response.status===500){// check error response status
                    if(err1.response.data.errno===19) toast.error("Server error: database constraint violation")// check for sql contraint violation
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
    <div style={{display: "flex", wrap: "nowrap", minWidth: "550px"}}>
        <Form>
            <div className="d-flex">
                <Form.File 
                    id="custom-file"
                    label= {Name + " .csv file"}
                    custom
                    onChange={(event) => setFiles(event.target.files)}
                />
            </div>
        </Form>
        <Button disabled={uploading||disabled||!files[0]} className="ml-3" variant="primary" onClick={() => sendFile()} style={{height: "38px"}}>
            {!uploading && <div>Send</div>}
            {uploading && <div style={{minWidth: "105px"}}><Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" style={{marginRight: "5px", marginBottom: "1.5px"}}/>Uploading...</div>}
        </Button>
            {uploading?<h3 style={{marginTop: "0px", marginLeft: "10px", color: "grey"}}>{percentage}%</h3>:<div/>}
            {!files[0]?<div style={{margin: "auto", marginLeft: "13px", color: "#999999", fontStyle: "italic"}}>{"Select a valid .csv file to upload"}</div>:<div/>}
            {disabled&&files[0]?<div style={{margin: "auto", marginLeft: "13px", color: "#999999", fontStyle: "italic"}}>
                    <MdErrorOutline style={{marginRight: "5px", marginBottom: "2pt"}}/>
                    {"Missing file dependencies"}
                </div>:<div/>}
    </div>
    )
}