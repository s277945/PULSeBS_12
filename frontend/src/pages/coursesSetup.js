import React, { useState, useEffect }  from 'react';
import Table from 'react-bootstrap/Table'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { getCoursesData } from '../api/api';
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'

export default function CoursesSetupView() {
    
    return(
        <>
            <br/>
            <h2 className="page-title">Courses setup</h2>
            <CoursesSetup/>
        </>
    )
}

const CoursesSetup = () => {
    const [courses, setCourses] = useState([]);
    const [yearsChecked, setYearsChecked] = useState([]);// init years array

    useEffect(() => {// fetch data from server
        getCoursesData()
            .then(response => {
                setCourses(response.data);
                console.log(response.data);
                let ytemp=[];// init new years array state
                let yctemp=[];// init new years checked array state
                for (let index in response.data){
                    console.log(response.data[index]);
                    if(!ytemp.includes(response.data[index].year)) ytemp.push(response.data[index].year);// add years as unique elements
                }
                for (let  index in ytemp){
                    yctemp.push({ year: ytemp[index], checked: false, semesters: [false, false] });
                }       
                setYearsChecked(yctemp);// set new years array state            
            })
            .catch(/* istanbul ignore next */err => {
                console.log(err);
            })
    }, []);

    const handleCheck = (type, selection) => {
        let newchecked=false;
        switch(type){
            case "y":
                for(let index in courses) {
                    if(courses[index].year===selection.year&&!courses[index].checked) {
                        newchecked=true;
                        break;
                    }
                }
                setCourses(courses.map(course=>{
                    if(course.year===selection.year) course.checked=newchecked;
                    return course
                }));
                if(newchecked) {
                    if(!selection.semesters[0]) semesterSetChecked(selection.year, 0);
                    if(!selection.semesters[1]) semesterSetChecked(selection.year, 1);
                }
                else {
                    if(selection.semesters[0]) semesterSetChecked(selection.year, 0);
                    if(selection.semesters[1]) semesterSetChecked(selection.year, 1);
                }
                
                
            break;
            case "s":
                for(let index in courses) {
                    if(courses[index].year===selection.year&&courses[index].semester===(selection.semester+1)&&!courses[index].checked) {
                        newchecked=true;
                        break;
                    }
                }
                setCourses(courses.map(course=>{
                    if(course.year===selection.year&&course.semester===(selection.semester+1)) course.checked=newchecked;
                    return course
                }));
                semesterSetChecked(selection.year, selection.semester);
            break;
            case "c":
                let newyearchecked=true;
                let newsemesterchecked=[true,true];
                let newcourses = courses.map(course=>{
                                            if(course.courseId===selection.courseId&&!course.checked) course.checked=true;
                                            else if(course.courseId===selection.courseId&&course.checked) course.checked=false;
                                            return course
                                        })
                setCourses(newcourses);
                for(let index in newcourses) {
                    if(newcourses[index].year===selection.year) {
                        if(!newcourses[index].checked) {
                            newyearchecked=false;
                            if(newcourses[index].semester===1) { newsemesterchecked[0]=false; break; }
                            if(newcourses[index].semester===2) { newsemesterchecked[1]=false; break; }
                        }
                    }
                }
                setYearsChecked(yearsChecked.map(y=>{
                    if(y.year===selection.year) {
                        y.checked=newyearchecked;
                        y.semesters[selection.semester-1]=newsemesterchecked[selection.semester-1];
                    }
                    return y
                }));
            break;
        }
    }

    const semesterSetChecked = (year, semester) => {
        let s1courses = courses.filter(course=>{return course.year===year&&course.semester===1}).length>0;
        let s2courses = courses.filter(course=>{return course.year===year&&course.semester===2}).length>0;
        if(s1courses&&semester===0||s2courses&&semester===1) setYearsChecked(yearsChecked.map(y=>{
            if(y.year===year&&!y.semesters[semester]) {
                y.semesters[semester]=true;
                if((!s1courses||y.semesters[0])&&(!s2courses||y.semesters[1])) y.checked=true;
            }
            else if(y.year===year) {
                y.semesters[semester]=false;
                y.checked=false;
            } 
            return y
        }));
    }

    const reset = () => {// selection reset function 
        setCourses(courses.map(course=>{
            course.checked=false;// turn all courses checkboxes to unchecked
            return course
        }));
        setYearsChecked(yearsChecked.map(y=>{// turn all year/semester checkboxes to unchecked
                y.checked=false;
                y.semesters[0]=false;
                y.semesters[1]=false;
            return y
        }));
    }

    return(
        <div className="accordion-container-1">
            <div style={{display: "flex", wrap: "nowrap", justifyContent: "space-between", marginTop: "13px", marginBottom: "13px"}}>
                <div/>
                <div>
                    <Button variant="info" style={{margin:"5px"}}>Turn to distance type</Button>
                    <Button style={{margin:"5px"}}>Turn to presence type</Button>
                    <Button variant="secondary" style={{margin:"5px"}}>Invert type</Button>
                    <Button variant="danger" style={{margin:"5px", marginRight:"17px"}} onClick={() => {reset()}}>Reset selection</Button>
                </div>
            </div>
            <div>
            {yearsChecked.map(year =>
                <Accordion key={year.year} style={{margin: "3px"}}>
                    <Card>
                        <div className="accordion-custom-setup-1">
                            <Accordion.Toggle as={Card.Header} onClick={(e) => {e.preventDefault();}} eventKey="0" style={{width: "97%", backgroundColor: "#F7F7F7", borderStyle: "none"}}>
                                <div style={{display: "flex",  flexWrap: "nowrap", justifyContent: "space-between"}}>
                                    <div style={{display: "flex",  flexWrap: "nowrap"}}><p style={{marginRight: "5px"}}>Year </p>{year.year}</div>
                                </div>
                            </Accordion.Toggle>
                            <Form.Check type="checkbox" style={{margin: "auto"}} checked={year.checked} onClick={()=>{handleCheck("y", year);}}/>
                        </div>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>
                                {courses.filter(course=>{return course.year===year.year&&course.semester===1}).length>0?
                                    <Accordion key={year.year+"s1"}>
                                        <Card>
                                            <div className="accordion-custom-setup-1">
                                                <Accordion.Toggle as={Card.Header} onClick={(e) => { e.preventDefault(); }} eventKey="0" style={{width: "97%", backgroundColor: "#F7F7F7", borderStyle: "none"}}>
                                                    <div style={{ display: "flex", flexWrap: "nowrap", justifyContent: "space-between" }}>
                                                        Semester 1
                                                    </div>
                                                </Accordion.Toggle>
                                                <Form.Check checked={year.semesters[0]} onClick={()=>{handleCheck("s", { year: year.year, semester: 0 });}} type="checkbox" style={{margin: "auto"}}/>
                                            </div>
                                            <Accordion.Collapse eventKey="0">
                                                <Card.Body>
                                                    <Table data-testid={year.year+'courses'+"s1"} striped bordered hover style={{ backgroundColor: "#fff" }}>
                                                        <thead>
                                                            <tr>
                                                                <th>Course</th>
                                                                <th>Distance course</th>
                                                                <th></th>
                                                            </tr>
                                                        </thead>
                                                        <thead>
                                                            {courses.filter(course=>{return course.year===year.year&&course.semester===1}).map(course=>
                                                                <tr>
                                                                    <td>{course.name+" ("+course.courseId+")"}</td>
                                                                    <td>{course.restriction?"Yes":"No"}</td>
                                                                    <td style={{width: "15px"}}><Form.Check checked={course.checked} onClick={()=>{handleCheck("c", course);}} style={{marginLeft: "4px"}} type="checkbox"/></td>
                                                                </tr>
                                                            )}
                                                        </thead>
                                                    </Table>
                                                </Card.Body>
                                            </Accordion.Collapse>
                                        </Card>
                                    </Accordion>
                                :<div/>}
                                {courses.filter(course=>{return course.year===year.year&&course.semester===2}).length>0?
                                    <Accordion key={year.year+"s2"}>
                                        <Card>
                                            <div className="accordion-custom-setup-1">
                                                <Accordion.Toggle as={Card.Header} onClick={(e) => { e.preventDefault(); }} eventKey="0" style={{width: "97%", backgroundColor: "#F7F7F7", borderStyle: "none"}}>
                                                    <div style={{ display: "flex", flexWrap: "nowrap", justifyContent: "space-between" }}>
                                                        Semester 2
                                                    </div>
                                                </Accordion.Toggle>
                                                <Form.Check checked={year.semesters[1]} onClick={()=>{handleCheck("s", { year: year.year, semester: 1 });}} type="checkbox" style={{margin: "auto"}}/>
                                            </div>
                                            <Accordion.Collapse eventKey="0">
                                                <Card.Body>
                                                    <Table data-testid={year.year+'courses'+"s2"} striped bordered hover style={{ backgroundColor: "#fff" }}>
                                                        <thead>
                                                            {courses.filter(course=>{return course.year===year.year&&course.semester===2}).map(course=>
                                                                <tr>
                                                                    <td>{course.name+" ("+course.courseId+")"}</td>
                                                                    <td style={{width: "15px"}}><Form.Check checked={course.checked} onClick={()=>{handleCheck("c", course);}} style={{marginLeft: "4px"}} type="checkbox"/></td>
                                                                </tr>
                                                            )}
                                                        </thead>
                                                    </Table>
                                                </Card.Body>
                                            </Accordion.Collapse>
                                        </Card>
                                    </Accordion>
                                :<div/>}
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
            )}
        </div></div>
    )
}