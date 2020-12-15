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
    const [semesters, setSemesters] = useState([]);// init semesters array
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
                        <Accordion.Toggle as={Card.Header} onClick={(e) => {e.preventDefault();}} eventKey="0">
                            <div style={{display: "flex",  flexWrap: "nowrap", justifyContent: "space-between"}}>
                                <div style={{display: "flex",  flexWrap: "nowrap"}}><p style={{marginRight: "5px"}}>Year </p>{year}</div>
                                <Form.Check type="checkbox"/>
                            </div>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>
                                
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
            )}
        </>
    )
}