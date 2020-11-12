import React, { Component } from 'react'
import axios from 'axios'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { Redirect } from 'react-router-dom'
import userIdentity from '../api/userIdentity.js'
import Navbar from 'react-bootstrap/Navbar'

export class Login extends Component {    
    state = {
        username: "",   //form values
        password: "",
        showErr: false, //form error state value
        showInvalidU: false, //username form invalid state value
        showInvalidP: false, //password form invalid state value
        redirect: 0     //redirect value
    }

    componentDidMount(){    
        console.log(this.props.context.userName!==null);    
        if (this.props.context.userName!==null && this.props.context.userType!==null) {
            console.log(this.props.context);
            this.props.context.userType==="s" ? this.setRedirect(2) : this.setRedirect(1); //check context for login data and set redirect value accordingly
        }
    }

    redirHome = (e) => { //function that redirects to the home page
        e.preventDefault();
        this.props.history.push("/");
    }

    setRedirect = (redir) => {
        this.setState({ redirect: redir })//set redirect value (0 = no redirect, 1 = teacher redirect, 2 = student redirect)
    }

    renderRedirect = () => {
        if (this.state.redirect===2) {
          return <Redirect to='/studentHome' />//redirect to student homepage if login was already done as student
        }
        else if(this.state.redirect===1) {
            return <Redirect to='/teacherHome' />//redirect to teacher homepage if login was already done as teacher
        }
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
        e.preventDefault();
        console.log(this.state.username + " " + this.state.password);
        if (this.state.username==="" || this.state.password==="") {
            if (this.state.username==="") this.setState({ showInvalidU: true });
            if (this.state.password==="") this.setState({ showInvalidP: true });
        }        
        else axios.post(`http://localhost:3001/api/login`, { userName: this.state.username, password: this.state.password },{ withCredentials: true, credentials: 'include' })//send post login request
        .then((res)=> {
            console.log(res);
            if(typeof res != 'undefined' && res.status===200) {
                let data= res.data;
                let uName = data.userID;
                let uType = data.userType;                    
                userIdentity.saveUserSession(this.props.context, uName, uType);//set user session data
                this.setRedirect(uType==='s' ? 2 : 1 );//set redirect value accordingly     
            }
            else console.log(res.status);
        })
        .catch(err=>{ console.log(err); this.setState({ showErr : true}); });
    }

    handleReset = (e) => {
        e.preventDefault();
        this.setState({ username: "", password: "", showInvalidU: false, showInvalidP: false });// reset invalid form state, reset form content
    }
    render() {

        return (
            <div style={{backgroundColor: "#efefef", height: "100vh"}}>
                {this.renderRedirect()}
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand href="#" onClick={this.redirHome}>PULSeBS</Navbar.Brand>
                </Navbar>
                <Form style={{display: "block", marginLeft: "auto", marginRight: "auto", paddingTop: "20vh", width: "300px",boxShadow: "2px 2px #c7c7c7", borderStyle: "solid", borderWidth: "1px", borderRadius: "15px", borderColor: "#a4a4a4", backgroundColor: "#fafafa", padding: "40px", marginTop: "23vh"}}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" placeholder="Your domain username" onChange={this.usernameChange} value={this.state.username} isInvalid={this.state.showInvalidU}/>
                        {   !this.state.showErr
                            ? <><Form.Text className="text-muted">Enter valid domain username</Form.Text></>
                            : null
                        }                        
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" onChange={this.passwordChange} value={this.state.password} isInvalid={this.state.showInvalidP}/>
                        {   this.state.showErr
                            ? <><Form.Text style={{color: "red", paddingTop: "5px", paddingBottom: "5px"}}>Invalid credentials</Form.Text></>
                            : null
                        }
                    </Form.Group>
                    
                    <Button variant="primary" type="submit" onClick={this.handleLogin} style={{marginRight: "25px", paddingRight: "17px", paddingLeft: "17px"}}>
                        Login
                    </Button>
                    <Button variant="secondary" type="submit" onClick={this.handleReset} >
                        Reset
                    </Button>
                </Form>
            </div>
        )
    
    }    
}
