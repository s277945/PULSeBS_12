import React, { Component } from 'react'
import axios from 'axios'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { Redirect } from 'react-router-dom'
import userIdentity from '../api/userIdentity.js'
import Navbar from 'react-bootstrap/Navbar'

export class Login extends Component {    
    state = {
        username: "",
        password: "",
        showErr: false,
        redirect: 0
    }

    componentDidMount(){
        console.log(this.props.context);
        if (this.props.context.userName && this.props.context.userType) {
            this.props.context.userType==='s' ? this.setRedirect(2) : this.setRedirect(1);//check context for login data and set redirect value accordingly
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
        if (/[a-zA-Z0-9_]/.test(lastchar)) this.setState({ username : e.target.value });// allow only numbers, letters and underscore as username form input
        else this.setState({ username : e.target.value.slice(0, -1)});// remove last character
    }

    passwordChange = (e) => {
        let lastchar=e.target.value.slice(-1);// extract last character
        if (/[a-zA-Z0-9_]/.test(lastchar)) this.setState({ password : e.target.value });// allow only numbers, letters and underscore as username form input
        else this.setState({ password : e.target.value.slice(0, -1)});// remove last character
    } 

    handleLogin = (e) => {
        e.preventDefault();
        this.setState({ showErr : false});
        console.log(this.state.username + " " + this.state.password);
        axios.post(`http://localhost:3001/api/login`, { userName: this.state.username, password: this.state.password })
        .then((res)=> {
            console.log(res);
            if(typeof res != 'undefined' && res.status===200) {
                let data= res.data;
                    let uName = data.userID;
                    let uType = data.userType;                    
                    userIdentity.saveUserSession(this.props.context, uName, uType);//set user session data
                    this.setRedirect(uType==='s' ? 2 : 1 );     
            }
            else console.log(res.status);
        })
        .catch(err=>{ console.log(err); this.setState({ showErr : true}); });
    }

    render() {

        return (
            <div>
                {this.renderRedirect()}
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand href="#" onClick={this.redirHome}>PULSeBS</Navbar.Brand>
                </Navbar>
                <Form style={{display: "block", marginLeft: "auto", marginRight: "auto", paddingTop: "20vh", width: "300px"}}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" placeholder="Enter username" onChange={this.usernameChange} value={this.state.username}/>
                        {   !this.state.showErr
                            ? <><Form.Text className="text-muted">Enter valid domain username</Form.Text></>
                            : null
                        }                        
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" onChange={this.passwordChange} value={this.state.password}/>
                    </Form.Group>
                    {   this.state.showErr
                        ? <><Form.Text className="text-muted"  style={{color: "red"}}>Invalid credentials</Form.Text></>
                        : null
                    }
                    <Button variant="primary" type="submit" onClick={this.handleLogin}>
                        Login
                    </Button>
                </Form>
            </div>
        )
    
    }    
}
