import React  from 'react';
import Navbar  from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import {useAuth} from '../components/Authsystem'
import SystemSetupView from './systemSetup'

export default function BookingManagerHome(){

    return(
        <>
            <NavBarOfficier />
            <h2 className="ml-4 mt-3">Upload data</h2>

            <SystemSetupView/>

        </>
    )
}

const NavBarOfficier = () => {
    const auth = useAuth();
    return(
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand>PULSeBS - System setup</Navbar.Brand>
            <Nav className="mr-auto"></Nav>
            <Nav.Link data-testid="logout" onClick={() => auth.signout()}>Logout</Nav.Link>
        </Navbar>
    )
}




