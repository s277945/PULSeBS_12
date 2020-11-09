import React, { Component } from 'react'
import axios from 'axios';
import Form from 'react-bootstrap/Form'
import { MainContext } from '../App.js';// import context hook from App.js
import { Redirect } from 'react-router-dom'
import userIdentity from '../api/userIdentity.js'
export class Login extends Component {    
    context = useContext(MainContext);// set up context value
    state = {
        username: "",
        password: "",
        showErr: false,
        redirect: 0
    }

    componentDidMount(){
        if (this.context.userName && this.context.userType) {
            this.context.userType==='s' ? this.setRedirect(2) : this.setRedirect(1);//check context for login data and set redirect value accordingly
        }
    }

    setRedirect = (redir) => {
        this.setState({ redirect: redir })//set redirect value (0 = no redirect, 1 = teacher redirect, 2 = student redirect)
    }

    renderRedirect = () => {
        if (this.state.redirect==2) {
          return <Redirect to='/studentHome' />//redirect to student homepage if login was already done as student
        }
        else if(this.state.redirect==1) {
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

    handleLogin = () => {
        this.setState({ showErr : false});
        fetch (`/api/login`, {// send post login request
            method: 'post',
            credentials: 'include',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify({ userName: username, password: password })
        })
        .then((res)=> {
            if(typeof res != 'undefined' && res.status===200) {
                res.json().then(data => {
                    let uName = data.userName;
                    let uType = data.userType;
                    this.context.setUserName(uName);//set user context data
                    this.context.setUserType(uType);
                    userIdentity.saveUserSession(uName, uType);//set user session data
                    resolve();
                })
                .catch(err=>{reject(err)});                
            }
            else reject(res.status);
        })
        .catch(err=>{ console.log(err); this.setState({ showErr : true}); });
    }

    render() {

        return (
            <div>
                {this.renderRedirect()}
                <Form>
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
                    <Button variant="primary" type="submit">
                        Login
                    </Button>
                </Form>
            </div>
        )
    
    }
}
