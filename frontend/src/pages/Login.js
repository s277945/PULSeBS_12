import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar'
import {authContext} from '../components/Authsystem'
import { withRouter } from 'react-router-dom';
import PropTypes from "prop-types";

export class Login extends Component{
    static contextType = authContext
    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
      };

    state = {
        username: "",   //form values
        password: "",
        showErr: false, //form error state value
        showInvalidU: false, //username form invalid state value
        showInvalidP: false, //password form invalid state value
        redirect: 0     //redirect value
    }

    usernameChange = (e) => {
        let lastchar=e.target.value.slice(-1);// extract last character
        if (/[a-zA-Z0-9_]/.test(lastchar)) {
            this.setState({ username : e.target.value });// allow only numbers, letters and underscore as username form input
            this.setState({ showInvalidU: false });// reset invalid username form state
        }
        else this.setState({ username : e.target.value.slice(0, -1)});// remove last character
    }

    passwordChange = (e) => {
        let lastchar=e.target.value.slice(-1);// extract last character
        if (/[a-zA-Z0-9?!,]/.test(lastchar)) {
            this.setState({ password : e.target.value });// allow only numbers and letters as password form input
            this.setState({ showInvalidP: false });// reset invalid password form state
        }
        else this.setState({ password : e.target.value.slice(0, -1)});// remove last character
    }

    handleLogin = (e) => {
        e.preventDefault()

        // Entries check
        if (this.state.username==="" || this.state.password==="") {
            if (this.state.username==="") this.setState({ showInvalidU: true });
            if (this.state.password==="") this.setState({ showInvalidP: true });
            return;
        }

        // Use auth system to login the user                    
        
        let history = this.props.history;
        this.context.signin(this.state.username, this.state.password)
            .then((user) => {

                // If he wen to /login directly, check his type and redirect him to the correct homepage
                switch(user.userType){
                    case 's':
                        history.replace('/studentHome')
                        break;
                    case 't':
                        history.replace('/teacherHome')
                        break;
                    default:
                        history.replace('/')
                        break;
                }
            })
            .catch(err => {
                console.log(err); this.setState({ showErr : true});
            })
    }

    handleReset = (e) => {
        e.preventDefault();
        this.setState({ username: "", password: "", showInvalidU: false, showInvalidP: false });// reset invalid form state, reset form content
    }

    handleRedirect = () => {
        let history = this.props.history;
        let location = this.props.location;
        // If user was redirect here, direct him back to the url he was coming  from
        if(this.context.user){
            if(location.state  && location.state.from) history.replace(location.state.from);
            else if(this.context.user.userType === "s") history.replace("/studentHome");
            else if(this.context.user.userType === "t") history.replace("/teacherHome");
            else return;
        }
    }

    render() { 
        {this.handleRedirect()}
        return (
            <div style={{backgroundColor: "#efefef", height: "100vh"}}>
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand href="#" onClick={this.redirHome}>PULSeBS</Navbar.Brand>
                </Navbar>
                <Form style={{display: "block", marginLeft: "auto", marginRight: "auto", paddingTop: "20vh", width: "300px",boxShadow: "2px 2px #c7c7c7", borderStyle: "solid", borderWidth: "1px", borderRadius: "15px", borderColor: "#a4a4a4", backgroundColor: "#fafafa", padding: "40px", marginTop: "23vh"}}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label style={{display: "block", textAlign: "center"}}>Username</Form.Label>
                        <Form.Control data-testid={"username"} type="text" placeholder="Your domain username" onChange={this.usernameChange} value={this.state.username} isInvalid={this.state.showInvalidU}/>
                        {   !this.state.showErr
                            ? <><Form.Text className="text-muted">Enter valid domain username</Form.Text></>
                            : null
                        }
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label style={{display: "block", textAlign: "center"}}>Password</Form.Label>
                        <Form.Control data-testid={"password"} type="password" placeholder="Password" onChange={this.passwordChange} value={this.state.password} isInvalid={this.state.showInvalidP}/>
                        {   this.state.showErr
                            ? <><Form.Text style={{color: "red", paddingTop: "5px", paddingBottom: "5px"}}>Invalid credentials</Form.Text></>
                            : null
                        }
                    </Form.Group>
                    <div style={{display: "flex", flexWrap: "nowrap",  justifyContent: "center"}}>
                        <Button data-testid={"submit"} variant="primary" type="submit" onClick={this.handleLogin} style={{marginRight: "25px", paddingRight: "17px", paddingLeft: "17px"}}>
                            Login
                        </Button>
                        <Button data-testid={"reset"} variant="secondary" type="submit" onClick={this.handleReset} >
                            Reset
                        </Button>
                    </div>
                </Form>
            </div>
        )

    }
}

export default withRouter(Login);
