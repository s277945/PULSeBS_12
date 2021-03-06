import React, { useState, useEffect }  from 'react';
import Table from 'react-bootstrap/Table'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { getCoursesData, postCoursesType } from '../api/api';
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'

export default function coursesSetup() {
    
    return(
        <>
            <br/>
            <h1 className="page-title">Courses setup</h1>
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
                    /* istanbul ignore else */
                    if(!ytemp.includes(response.data[index].year)) ytemp.push(response.data[index].year);// add years as unique elements
                    /* istanbul ignore else */
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
                    /* istanbul ignore else */
                }
                setCourses(courses.map(course=>{
                    if(course.year===selection.year) course.checked=newchecked;
                    return course
                }));
                if(newchecked) {
                    /* istanbul ignore else */
                    if(!selection.semesters[0]) semesterSetChecked(selection.year, 0);
                    /* istanbul ignore else */
                    if(!selection.semesters[1]) semesterSetChecked(selection.year, 1);
                }
                else {
                    /* istanbul ignore else */
                    if(selection.semesters[0]) semesterSetChecked(selection.year, 0);
                    /* istanbul ignore else */
                    if(selection.semesters[1]) semesterSetChecked(selection.year, 1);
                }
                
                
            break;
            case "s":
                for(let index in courses) {
                    /* istanbul ignore else */
                    if(courses[index].year===selection.year&&courses[index].semester===(selection.semester+1)&&!courses[index].checked) {
                        newchecked=true;
                        break;
                    }
                    /* istanbul ignore else */
                }
                setCourses(courses.map(course=>{
                    if(course.year===selection.year&&course.semester===(selection.semester+1)) course.checked=newchecked;
                    /* istanbul ignore else */
                    return course
                }));
                semesterSetChecked(selection.year, selection.semester);
            break;
            case "c":
                let newyearchecked=true;
                let newsemesterchecked=[true,true];
                let newcourses = courses.map(course=>{
                    /* istanbul ignore else */
                                            if(course.courseId===selection.courseId&&!course.checked) course.checked=true;
                                            else if(course.courseId===selection.courseId&&course.checked) course.checked=false;
                                            /* istanbul ignore else */

                                            return course
                                        })
                setCourses(newcourses);
                for(let index in newcourses) {
                    /* istanbul ignore else */
                    if(newcourses[index].year===selection.year) {
                        /* istanbul ignore else */
                        if(!newcourses[index].checked) {
                            newyearchecked=false;
                            /* istanbul ignore else */
                            if(newcourses[index].semester===1) { newsemesterchecked[0]=false; break; }
                            /* istanbul ignore else */
                            if(newcourses[index].semester===2) { newsemesterchecked[1]=false; break; }
                        }
                        /* istanbul ignore else */
                    }
                    /* istanbul ignore else */
                }
                setYearsChecked(yearsChecked.map(y=>{
                    if(y.year===selection.year) {
                        y.checked=newyearchecked;
                        y.semesters[selection.semester-1]=newsemesterchecked[selection.semester-1];
                    }
                    /* istanbul ignore else */
                    return y
                }));
            break;
        }
    }

    const semesterSetChecked = (year, semester) => {
        let s1courses = courses.filter(course=>{return course.year===year&&course.semester===1}).length>0;
        let s2courses = courses.filter(course=>{return course.year===year&&course.semester===2}).length>0;
        /* istanbul ignore else */
        if(s1courses&&semester===0||s2courses&&semester===1) setYearsChecked(yearsChecked.map(y=>{
            /* istanbul ignore else */
            if(y.year===year&&!y.semesters[semester]) {
                y.semesters[semester]=true;
                /* istanbul ignore else */
                if((!s1courses||y.semesters[0])&&(!s2courses||y.semesters[1])) y.checked=true;
                /* istanbul ignore else */
            }
            else if(y.year===year) {
                y.semesters[semester]=false;
                y.checked=false;
            }
            /* istanbul ignore else */
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

    const invertType = () => {
        let newcourses = courses.map(course=>{// update internal state
            if(course.checked&&course.restriction===1) course.restriction=0;
            else if(course.checked&&course.restriction===0) course.restriction=1;
            /* istanbul ignore else */
            console.log(course.restriction);
            return course;
        });
        let coursesData=newcourses.filter(course=>course.checked);
        postCoursesType(coursesData)// server post
            .then(response => {console.log(response);
                setCourses(newcourses);
                reset();
            })
            .catch(/* istanbul ignore next */err => {
                console.log(err);
            })
    }

    const invertSelection=()=>{// invert check selection
        setYearsChecked(yearsChecked.map(y=>{//check all cases and update checked states for years/semesters
            let s1num = courses.filter(course=>{ return (course.year===y.year&&course.semester===1&&course.checked);}).length;
            let s2num = courses.filter(course=>{ return (course.year===y.year&&course.semester===2&&course.checked);}).length;
            console.log(s1num)
            console.log(s2num)
            if(y.checked===true){
                y.checked=false;
                y.semesters[0]=false;
                y.semesters[1]=false;
            }
            else{
                /* istanbul ignore else */
                if(s1num===0&&s2num===0) {
                    y.checked=true;
                    y.semesters[0]=true;
                    y.semesters[1]=true;
                }
                else if(s1num===0) {
                    y.checked=false;
                    y.semesters[0]=true;
                    y.semesters[1]=false;
                }
                else if(s2num===0) {
                    y.checked=false;
                    y.semesters[0]=false;
                    y.semesters[1]=true;
                }
                else    {
                    y.checked=false;
                    y.semesters[0]=false;
                    y.semesters[1]=false;
                }
            }

            return y;
        }))
        setCourses(courses.map(course=>{//update checked states courses
            if(course.checked===true)
                course.checked=false;
            else
                course.checked=true;
            return course;
        }));
    }

    const invertDisable = () => {
        return courses.filter(course=>course.checked).length===0;
    }

    const selectAll = () => {// select all courses function 
        setCourses(courses.map(course=>{
            course.checked=true;// turn all courses checkboxes to checked
            return course
        }));
        setYearsChecked(yearsChecked.map(y=>{// turn all year/semester checkboxes to checked
                y.checked=true;
                y.semesters[0]=true;
                y.semesters[1]=true;
            return y
        }));
    }

    const selectAllDisable = () => {// selectall disable function 
        return courses.filter(course=>(!course.checked)).length===0;// check if all courses are selected
    }

    const turnToDistance = () => {
        let newcourses=courses.map(course=>{// init new courses array
            if(course.checked&&course.restriction===0) course.restriction=1;
            /* istanbul ignore else */
            return course;
        })
        let coursesData=newcourses.filter(course=>course.checked);//filter data to send
        postCoursesType(coursesData)// send data to server
            .then(res=>{
                console.log(res);
                setCourses(newcourses);// update state
                reset();
            })
            .catch(/* istanbul ignore next */err => {
                console.log(err);
            })
    }

    const distanceDisable = () => {
        return courses.filter(course=>(course.checked&&course.restriction===0)).length===0;// check if there are courses without restriction in selection
    }

    const turnToPresence = () => {
         let newcourses=courses.map(course=>{// init new courses array
             /* istanbul ignore else */
             if(course.checked&&course.restriction===1) course.restriction=0;
             /* istanbul ignore else */
            return course;
        })
        let coursesData=newcourses.filter(course=>course.checked);//filter data to send
        postCoursesType(coursesData)// send data to server
            .then(res=>{
                console.log(res);
                setCourses(newcourses);// update state
                reset();
            })
            .catch(/* istanbul ignore next */err => {
                console.log(err);
            })
    }

    const presenceDisable = () => {
        return courses.filter(course=>(course.checked&&course.restriction===1)).length===0;// check if there are courses with restriction in selection
    }

    return(
        <div>
            <div style={{display: "flex", wrap: "nowrap", justifyContent: "flex-start", marginTop: "4vh", marginBottom: "10px"}}>
                <div/>
                <div style={{display: "flex", wrap: "nowrap"}}>
                    <Button variant="info" style={{margin:"5px", marginLeft:"27px"}} disabled={distanceDisable()} onClick={() => {turnToDistance()}}>Make not bookable</Button>
                    <Button style={{margin:"5px"}} disabled={presenceDisable()} onClick={() => {turnToPresence()}}>Make bookable</Button>
                    <Button variant="secondary" style={{margin:"5px"}} disabled={invertDisable()} onClick={() => {invertType()}}>Invert type</Button>
                </div>
                <div style={{margin: "auto"}}></div>
                <div  style={{display: "flex", wrap: "nowrap"}}>                    
                    <Button variant="secondary" style={{margin:"5px"}} disabled={selectAllDisable()} onClick={() => {selectAll()}}>Select all</Button>                    
                    <Button variant="secondary" style={{margin:"5px"}} disabled={invertDisable()} onClick={() => {invertSelection()}}>Invert selection</Button>
                    <Button variant="danger" style={{margin:"5px", marginRight:"27px"}} disabled={invertDisable()} onClick={() => {reset()}}>Deselect all</Button>
                </div>
            </div>
            <div className="accordion-container-1">
            {yearsChecked.map(year =>
                <Accordion key={year.year} style={{margin: "3px"}}>
                    <Card>
                        <div className="accordion-custom-setup-1">
                            <Accordion.Toggle as={Card.Header} onClick={(e) => {e.preventDefault();}} eventKey="0" style={{width: "97%", backgroundColor: "#F7F7F7", borderStyle: "none"}}>
                                <div style={{display: "flex",  flexWrap: "nowrap", justifyContent: "flex-start", alignItems: "cnter", marginTop: "13px"}}>
                                    <h5 style={{marginRight: "5px"}}>Year </h5><h5>{year.year}</h5>
                                    <p style={{fontStyle: "italic", marginLeft: "17px", marginTop: "1px", color: "#888888"}}>{courses.filter(course=>(course.year===year.year&&course.restriction===1)).length}</p><p style={{fontStyle: "italic", marginLeft: "5px", marginTop: "1px", color: "#888888"}}>remote courses,</p>
                                    <p style={{fontStyle: "italic", marginLeft: "7px", marginTop: "1px", color: "#888888"}}>{courses.filter(course=>(course.year===year.year&&course.restriction===0)).length}</p><p style={{fontStyle: "italic", marginLeft: "5px", marginTop: "1px", color: "#888888"}}>courses in presence</p>
                                </div>
                            </Accordion.Toggle>
                            <Form.Check data-testid={"year"} type="checkbox" style={{margin: "auto"}} checked={year.checked} onClick={()=>{handleCheck("y", year);}}/>
                        </div>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>
                                {courses.filter(course=>{return course.year===year.year&&course.semester===1}).length>0?
                                    <Accordion key={year.year+"s1"}>
                                        <Card>
                                            <div className="accordion-custom-setup-1">
                                                <Accordion.Toggle as={Card.Header} onClick={(e) => { e.preventDefault(); }} eventKey="0" style={{width: "97%", backgroundColor: "#F7F7F7", borderStyle: "none", height: "48px"}}>
                                                    <div style={{ display: "flex", flexWrap: "nowrap", justifyContent: "flex-start"}}>
                                                        Semester 1
                                                        <p style={{fontStyle: "italic", fontSize: "13px", marginLeft: "17px", color: "#888888", marginTop: "2pt"}}>{courses.filter(course=>(course.year===year.year&&course.semester===1&&course.restriction===1)).length}</p><p style={{fontStyle: "italic", fontSize: "13px", marginLeft: "5px", color: "#888888", marginTop: "2pt"}}>remote courses,</p>
                                                        <p style={{fontStyle: "italic", fontSize: "13px", marginLeft: "7px", color: "#888888", marginTop: "2pt"}}>{courses.filter(course=>(course.year===year.year&&course.semester===1&&course.restriction===0)).length}</p><p style={{fontStyle: "italic", fontSize: "13px", marginLeft: "5px", color: "#888888", marginTop: "2pt"}}>courses in presence</p>
                                                    </div>
                                                </Accordion.Toggle>
                                                <Form.Check checked={year.semesters[0]} onClick={()=>{handleCheck("s", { year: year.year, semester: 0 });}} type="checkbox" style={{margin: "auto"}}/>
                                            </div>
                                            <Accordion.Collapse eventKey="0">
                                                <Card.Body>
                                                    <Table className="app-element-background-3" data-testid={year.year+'courses'+"s1"} striped bordered hover style={{ backgroundColor: "#fff" }}>
                                                        <thead>
                                                            <tr>
                                                                <th>Course</th>
                                                                <th>Bookable</th>
                                                                <th></th>
                                                            </tr>
                                                        </thead>
                                                        <thead>
                                                            {courses.filter(course=>{return course.year===year.year&&course.semester===1}).map(course=>
                                                                <tr>
                                                                    <td>{course.name+" ("+course.courseId+")"}</td>
                                                                    <td>{course.restriction===1?"No":"Yes"}</td>
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
                                                <Accordion.Toggle as={Card.Header} onClick={(e) => { e.preventDefault(); }} eventKey="0" style={{width: "97%", backgroundColor: "#F7F7F7", borderStyle: "none", height: "48px"}}>
                                                    <div style={{ display: "flex", flexWrap: "nowrap", justifyContent: "flex-start" }}>
                                                        Semester 2
                                                        <p style={{fontStyle: "italic", fontSize: "13px", marginLeft: "17px", color: "#888888", marginTop: "2pt"}}>{courses.filter(course=>(course.year===year.year&&course.semester===2&&course.restriction===1)).length}</p><p style={{fontStyle: "italic", fontSize: "13px", marginLeft: "5px", color: "#888888", marginTop: "2pt"}}>remote courses,</p>
                                                        <p style={{fontStyle: "italic", fontSize: "13px", marginLeft: "7px", color: "#888888", marginTop: "2pt"}}>{courses.filter(course=>(course.year===year.year&&course.semester===2&&course.restriction===0)).length}</p><p style={{fontStyle: "italic", fontSize: "13px", marginLeft: "5px", color: "#888888", marginTop: "2pt"}}>courses in presence</p>                                                    </div>
                                                </Accordion.Toggle>
                                                <Form.Check checked={year.semesters[1]} onClick={()=>{handleCheck("s", { year: year.year, semester: 1 });}} type="checkbox" style={{margin: "auto"}}/>
                                            </div>
                                            <Accordion.Collapse eventKey="0">
                                                <Card.Body>
                                                    <Table className="app-element-background-3" data-testid={year.year+'courses'+"s2"} striped bordered hover style={{ backgroundColor: "#fff" }}>
                                                    <thead>
                                                            <tr>
                                                                <th>Course</th>
                                                                <th>Bookable</th>
                                                                <th></th>
                                                            </tr>
                                                        </thead>
                                                        <thead>
                                                            {courses.filter(course=>{return course.year===year.year&&course.semester===2}).map(course=>
                                                                <tr>
                                                                    <td>{course.name+" ("+course.courseId+")"}</td>
                                                                    <td>{course.restriction===1?"No":"Yes"}</td>
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