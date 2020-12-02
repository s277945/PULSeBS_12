
import React, { useState, useEffect }  from 'react';
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import Table from 'react-bootstrap/Table'
import Form from 'react-bootstrap/Form'
import Navbar  from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import {useAuth} from '../components/Authsystem'
import {getAllCoursesForBookingManager, getStatsByCourseID, getLecturesStatsByCourseID} from '../api/api'

/**
 * Page that will display the monitoring of usage (bookings, cancellations, attendance)
 */
export default function BookingManagerHome(){
    const [courses, setCourses] = useState([]);

    //  will run after the render (like componentDidMount), see https://reactjs.org/docs/hooks-reference.html#useeffect
    useEffect(() => {
        if(!courses.length){
            getAllCoursesForBookingManager().then(response => {
                // console.log(response)
                setCourses(response.data)
            })
        }
    });

    const getStatsForCourse = (CourseID) => {
        const courseIndex = courses.findIndex(course => course.CourseID === CourseID);

        if(courses[courseIndex].stats) return;

        getStatsByCourseID(CourseID).then(response => {
            const newCourses = courses.slice();
            newCourses[courseIndex].stats = response.data;

            setCourses(newCourses)
        })

        getLecturesStatsByCourseID(CourseID).then(response => {
            console.log(response)
            const newCourses = courses.slice();
            newCourses[courseIndex].lectureStats = response.data;
            setCourses(newCourses)
        })
    }

    return(
        <>
            <NavBarBooking />

            {courses.map(course => 
                <Accordion key={course.Name}>
                <Card>
                    <Accordion.Toggle as={Card.Header} onClick={() => getStatsForCourse(course.CourseID)} eventKey="0">
                    {course.Name}
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                    <Card.Body>
                        <h5>Total Information</h5>
                        <CourseTableInfo courseStats={course.stats} lectureStats={course.lectureStats}/>
                        <br/>
                        <h5>Information by Lecture</h5>
                        <LectureStats courseStats={course.stats} lectureStats={course.lectureStats} />
                    </Card.Body>
                    </Accordion.Collapse>
                </Card>
                </Accordion>
            )}
        </>
    )
}

const NavBarBooking = () => {
    const auth = useAuth();
    return(
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand>PULSeBS - SystemActivity</Navbar.Brand>
            <Nav className="mr-auto"></Nav>
            <Nav.Link data-testid="logout" onClick={() => auth.signout()}>Logout</Nav.Link>
        </Navbar>
    )
}


const CourseTableInfo = ({courseStats, lectureStats}) =>{
    if(!courseStats || !lectureStats) return <></>

    return(
        <Table striped bordered hover>
        <thead>
            <tr>
            <th>Lecture in total</th>
            <th>Bookings</th>
            <th>Cancellations</th>
            <th>Attendance</th>
            </tr>
        </thead>
        <tbody>
            <tr>
            <td>{lectureStats.length}</td>
            <td>{courseStats.nBooked}</td>
            <td>{courseStats.nCancellations}</td>
            <td>{courseStats.nAttendance}</td>
            </tr>
        </tbody>
        </Table>
    )
}

const LectureStats = ({courseStats, lectureStats }) =>{
    const [selectedLecture, setSelectedLecture] = useState();

    useEffect(() => {
        if(lectureStats && !selectedLecture){
            setSelectedLecture(lectureStats[0].lectureName)
        }
    });

    if(!lectureStats) return<></>;

    return(
        <>
            <LectureCourseSelector lectureStats={lectureStats} setSelectedLecture={setSelectedLecture}/>
            <LectureTableInfo selectedLecture={selectedLecture} lectureStats={lectureStats}/>
        </>
    )
}

const LectureCourseSelector = ({lectureStats, setSelectedLecture}) =>{
    if(!lectureStats) return <></>

    return(
        <Form.Group controlId="exampleForm.SelectCustom">
        <Form.Control as="select" custom onChange={(value) => setSelectedLecture(value.target.value)}>
            {lectureStats.map(lecture => 
                <option key={lecture.lectureName} value={lecture.lectureName}>{lecture.lectureName}</option>
            )}
        </Form.Control>
        </Form.Group>
    )
}


const LectureTableInfo = ({lectureStats, selectedLecture}) =>{
    if(!lectureStats || !selectedLecture) return <></>

    const lecture = lectureStats.find((lecture) => lecture.lectureName === selectedLecture)
    if(!lecture) return<></>;

    return(
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
            <td>{lecture.nBooked}</td>
            <td>{lecture.nCancellations}</td>
            <td>{lecture.nAttendance}</td>
            </tr>
        </tbody>
        </Table>
    )
}
