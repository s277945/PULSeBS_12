
import React from 'react';
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import Table from 'react-bootstrap/Table'
import Form from 'react-bootstrap/Form'
import Navbar  from 'react-bootstrap/Navbar'

export default function BookingManagerHome(){
    return(
        <>
            <NavBarManager />

            <Accordion defaultActiveKey="0">
            <Card>
                <Accordion.Toggle as={Card.Header} eventKey="0">
                Course Name 1
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                <Card.Body>
                    <h5>Total Information</h5>
                    <CourseTableInfo />
                    <br/>
                    <h5>Information by Lecture</h5>
                    <LectureCourseSelector />
                    <LectureTableInfo />
                </Card.Body>
                </Accordion.Collapse>
            </Card>
            <Card>
                <Accordion.Toggle as={Card.Header} eventKey="1">
                Course Name 2
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="1">
                <Card.Body>Hello! I'm another body</Card.Body>
                </Accordion.Collapse>
            </Card>
            </Accordion>
        </>
    )
}

const NavBarManager = () => 
    <Navbar bg="dark" variant="dark">
        <Navbar.Brand>PULSeBS - SystemActivity</Navbar.Brand>
    </Navbar>

const CourseTableInfo = () => 
    <Table striped bordered hover>
    <thead>
        <tr>
        <th>Lectures in total</th>
        <th>Bookings</th>
        <th>Cancellations</th>
        <th>Attendance</th>
        </tr>
    </thead>
    <tbody>
        <tr>
        <td>10</td>
        <td>500</td>
        <td>119</td>
        <td>381</td>
        </tr>
    </tbody>
    </Table>

const LectureCourseSelector = () =>
  <Form.Group controlId="exampleForm.SelectCustom">
    <Form.Control as="select" custom>
      <option>Lecture 1</option>
      <option>Lecture 2</option>
      <option>Lecture 3</option>
    </Form.Control>
  </Form.Group>
    
const LectureTableInfo = () => 
    <Table striped bordered hover>
    <thead>
        <tr>
        <th>Bookings</th>
        <th>Cancellations</th>
        <th>Attendance</th>
        </tr>
    </thead>
    <tbody>
        <tr>
        <td>97</td>
        <td>13</td>
        <td>84</td>
        </tr>
    </tbody>
    </Table>