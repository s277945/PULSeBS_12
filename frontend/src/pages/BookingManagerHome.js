
import React, { useState, useEffect } from 'react';
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import Table from 'react-bootstrap/Table'
import Form from 'react-bootstrap/Form'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import { useAuth } from '../components/Authsystem'
import { getAllCoursesForBookingManager, getStatsByCourseID, getLecturesStatsByCourseID } from '../api/api'
import {BookingManagerReport} from './BookingManagerReport'

/**
 * Page that will display the monitoring of usage (bookings, cancellations, attendance)
 */
export default function BookingManagerHome() {
    const [courses, setCourses] = useState([]);
    //default show first tab (0)
    const [show, setShow] = useState(0);

    //  will run after the render (like componentDidMount), see https://reactjs.org/docs/hooks-reference.html#useeffect
    useEffect(() => {
        if (!courses.length) {
            getAllCoursesForBookingManager().then(response => {
                // console.log(response)
                setCourses(response.data)
            })
        }
    });

    const getStatsForCourse = (CourseID) => {
        const courseIndex = courses.findIndex(course => course.CourseID === CourseID);
        /* istanbul ignore if */
        if (courses[courseIndex].stats)
            return;

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

    const setShowNav = (val) => {
        setShow(val);
    }

    const contentSelect = () => {
        if (show === 0) return (
            <div className="app-background"><br></br><h1 className="page-title">System monitoring</h1><br></br>
                <h5 style={{marginLeft: "17px", fontWeight: "bold", marginBottom: "15px"}}>Select by course: </h5>
                {courses.map(course =>
                    <Accordion key={course.Name}>
                        <Card>
                            <Accordion.Toggle as={Card.Header} onClick={() => getStatsForCourse(course.CourseID)} eventKey="0">
                                {course.Name}
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="0">
                                <Card.Body>
                                    <h5>Total Information</h5>
                                    <CourseTableInfo courseStats={course.stats} lectureStats={course.lectureStats} />
                                    <br />
                                    <h5>Information by Lecture</h5>
                                    <LectureStats courseStats={course.stats} lectureStats={course.lectureStats} />
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>
                )}
            </div>
        )

        if (show === 1) return (
            <div className="app-background">
                <BookingManagerReport />
            </div>
        )

        /* istanbul ignore else */
        else return (
            <div>
            </div>
        )
    }

    return (
        <>
            <NavBarBooking show={show} setShowNav={setShowNav} />
            {contentSelect()}

        </>
    )
}

const NavBarBooking = ({show, setShowNav}) => {
    const auth = useAuth();

    const showSysMon = () => {setShowNav(0)}

    const showReport = () => {setShowNav(1)}

    return (
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand>PULSeBS - SystemActivity</Navbar.Brand>
            <Nav className="mr-auto">
                <Nav.Link data-testid="sysMon" href="#sysMon" active={show===0} onSelect={showSysMon}>System Monitoring</Nav.Link>
                <Nav.Link data-testid="report" href="#report" active={show===1} onSelect={showReport}>Students Report</Nav.Link>
            </Nav>
            <Nav.Link data-testid="logout" onClick={() => auth.signout()}>Logout</Nav.Link>
        </Navbar>
    )
}


const CourseTableInfo = ({ courseStats, lectureStats }) => {
    if (!courseStats || !lectureStats) return <></>

    return (
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

const LectureStats = ({ courseStats, lectureStats }) => {
    const [selectedLecture, setSelectedLecture] = useState();

    useEffect(() => {
        if (lectureStats && !selectedLecture) {
            setSelectedLecture(lectureStats[0].lectureName)
        }
    });

    if (!lectureStats) return <></>;

    return (
        <>
            <LectureCourseSelector lectureStats={lectureStats} setSelectedLecture={setSelectedLecture} />
            <LectureTableInfo selectedLecture={selectedLecture} lectureStats={lectureStats} />
        </>
    )
}

const LectureCourseSelector = ({ lectureStats, setSelectedLecture }) => {
    /* istanbul ignore if */
    if (!lectureStats)
        return <></>

    return (
        <Form.Group controlId="exampleForm.SelectCustom">
            <Form.Control as="select" custom onChange={(value) => setSelectedLecture(value.target.value)}>
                {lectureStats.map(lecture =>
                    <option key={lecture.lectureName} value={lecture.lectureName}>{lecture.lectureName}</option>
                )}
            </Form.Control>
        </Form.Group>
    )
}


const LectureTableInfo = ({ lectureStats, selectedLecture }) => {

    if (!lectureStats || !selectedLecture)
        return <></>

    const lecture = lectureStats.find((lecture) => lecture.lectureName === selectedLecture)
    /* istanbul ignore if */
    if (!lecture)
        return <></>;

    return (
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
