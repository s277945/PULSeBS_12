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
    const [years, setYears] = useState([]);// init years array
    useEffect(() => {// fetch data from server
        getCoursesData()
            .then(response => {
                setCourses(response.data);
                console.log(response.data);
                let ytemp=[];// init new years array state
                for (let index in response.data){
                    console.log(response.data[index]);
                    if(!ytemp.includes(response.data[index].year)) ytemp.push(response.data[index].year);// add years as unique elements
                }
                setYears(ytemp);// set new years array state                
            })
            .catch(/* istanbul ignore next */err => {
                console.log(err);
            })
    }, []);

    return(
        <>
            {years.map(year =>
                <Accordion key={year}>
                    <Card>
                        <div className="accordion-custom-setup-1">
                            <Accordion.Toggle as={Card.Header} onClick={(e) => {e.preventDefault();}} eventKey="0" style={{width: "97%", backgroundColor: "#F7F7F7", borderStyle: "none"}}>
                                <div style={{display: "flex",  flexWrap: "nowrap", justifyContent: "space-between"}}>
                                    <div style={{display: "flex",  flexWrap: "nowrap"}}><p style={{marginRight: "5px"}}>Year </p>{year}</div>
                                </div>
                            </Accordion.Toggle>
                            <Form.Check type="checkbox"  onClick={(e) => {e.preventDefault();}} style={{margin: "auto"}}/>
                        </div>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>
                                {courses.filter(course=>{return course.year===year&&course.semester===1}).length>0?
                                    <Accordion key={year+"s1"}>
                                        <Card>
                                            <div className="accordion-custom-setup-1">
                                                <Accordion.Toggle as={Card.Header} onClick={(e) => { e.preventDefault(); }} eventKey="0" style={{width: "97%", backgroundColor: "#F7F7F7", borderStyle: "none"}}>
                                                    <div style={{ display: "flex", flexWrap: "nowrap", justifyContent: "space-between" }}>
                                                        Semester 1
                                                    </div>
                                                </Accordion.Toggle>
                                                <Form.Check type="checkbox" style={{margin: "auto"}}/>
                                            </div>
                                            <Accordion.Collapse eventKey="0">
                                                <Card.Body>
                                                    <Table data-testid={year+'courses'+"s1"} striped bordered hover style={{ backgroundColor: "#fff" }}>
                                                        <thead>
                                                            {courses.filter(course=>{return course.year===year&&course.semester===1}).map(course=>
                                                                <tr>
                                                                    <td>{course.name}</td>
                                                                    <td style={{width: "15px"}}><Form.Check style={{marginLeft: "4px"}} type="checkbox"/></td>
                                                                </tr>
                                                            )}
                                                        </thead>
                                                    </Table>
                                                </Card.Body>
                                            </Accordion.Collapse>
                                        </Card>
                                    </Accordion>
                                :<div/>}
                                {courses.filter(course=>{return course.year===year&&course.semester===2}).length>0?
                                    <Accordion key={year+"s2"}>
                                        <Card>
                                            <Accordion.Toggle as={Card.Header} onClick={(e) => { e.preventDefault(); }} eventKey="0">
                                                <div style={{ display: "flex", flexWrap: "nowrap", justifyContent: "space-between" }}>
                                                    Semester 2
                                                    <Form.Check type="checkbox" />
                                                </div>
                                            </Accordion.Toggle>
                                            <Accordion.Collapse eventKey="0">
                                                <Card.Body>
                                                <Table data-testid={year+'courses'+"s2"} striped bordered hover style={{ backgroundColor: "#fff" }}>
                                                        <thead>
                                                            {courses.filter(course=>{return course.year===year&&course.semester===2}).map(course=>
                                                                <tr>
                                                                    <td>{course.name}</td>
                                                                    <td style={{width: "15px"}}><Form.Check style={{marginLeft: "4px"}} type="checkbox"/></td>
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
        </>
    )
}