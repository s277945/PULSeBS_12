import React, { useState }  from 'react';
import Navbar  from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import {useAuth} from '../components/Authsystem'
import SystemSetup from './SystemSetup'
import CoursesSetup  from './coursesSetup'
import {SupportOfficerSchedule} from './SupportOfficerSchedule'
export default function SupportOfficerHome(){
    const [show, setShow] = useState(0);// element render selection state
    return(
        <>
            <NavBarOfficer show={show} setShow={setShow}/>
            <div className="app-element-background-2">
                {show===0?<SystemSetup/>:(show===1?<CoursesSetup/>:<SupportOfficerSchedule/>)}
            </div>
        </>
    )
}

const NavBarOfficer = (props) => {// page navbar
    const auth = useAuth();
    return(
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand>PULSeBS</Navbar.Brand>
            <Nav className="mr-auto">
            <Nav.Link data-testid="setup" href="#sysetup" active={props.show===0?true:false} onClick={() => props.setShow(0)}>System setup</Nav.Link>
            <Nav.Link data-testid="updatebookable" href="#coursetup" active={props.show===1?true:false} onClick={() => props.setShow(1)}>Courses setup</Nav.Link>
            <Nav.Link data-testid="schedule" href="#updateSchedule" active={props.show===2?true:false} onClick={()=>props.setShow(2)}>Schedule setup</Nav.Link>
            </Nav>
            <Nav.Link data-testid="logout" onClick={() => auth.signout()}>Logout</Nav.Link>
        </Navbar>
    )
}




