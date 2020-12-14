import React, { useState }  from 'react';
import Navbar  from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import {useAuth} from '../components/Authsystem'
import SystemSetupView from './systemSetup'

export default function BookingManagerHome(){
    const [show, setShow] = useState(0);// element render selection state
    return(
        <>
            <NavBarOfficer show={show} setShow={setShow}/>
            {show===0?<SystemSetupView/>:<div/>}

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
            </Nav>
            <Nav.Link data-testid="logout" onClick={() => auth.signout()}>Logout</Nav.Link>
        </Navbar>
    )
}




