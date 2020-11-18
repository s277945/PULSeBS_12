import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar'
import {authContext} from '../components/Authsystem'
import { withRouter } from 'react-router-dom';
import PropTypes from "prop-types";

class Login extends Component{
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
        console.log(this.state.username + " " + this.state.password);

        // Entries check
        if (this.state.username==="" || this.state.password==="") {
            if (this.state.username==="") this.setState({ showInvalidU: true });
            if (this.state.password==="") this.setState({ showInvalidP: true });
            return;
        }

        this.context.signin(this.state.username, this.state.password)
            .then((user) => {
                let history = this.props.history;
                let location = this.props.location;

                if(location.state  && location.state.from){
                    history.replace(location.state.from)
                }

                switch(user.userType){
                    case 's':
                        history.replace('/studentHome')
                        break;
                    case 't':
                        history.replace('/teacherHome')
                        break;
                }
            })
            .catch(err => {
                console.log(err); this.setState({ showErr : true}); 
            })

        // axios.post(`http://localhost:3001/api/login`, { userName: this.state.username, password: this.state.password },{ withCredentials: true, credentials: 'include' })//send post login request
        // .then((res)=> {
        //     console.log(res);
        //     if(typeof res != 'undefined' && res.status===200) {
        //         let data= res.data;
        //         let uName = data.userID;
        //         let uType = data.userType;                    
        //         userIdentity.saveUserSession(this.props.context, uName, uType);//set user session data
        //         this.setRedirect(uType==='s' ? 2 : 1 );//set redirect value accordingly     
        //     }
        //     if(res) console.log(res.status);
        // })
        // .catch(err=>{ });
    }

    handleReset = (e) => {
        e.preventDefault();
        this.setState({ username: "", password: "", showInvalidU: false, showInvalidP: false });// reset invalid form state, reset form content
    }
    
    render() {
        return (
            <div style={{backgroundColor: "#efefef", height: "100vh"}}>
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand href="#" onClick={this.redirHome}>PULSeBS</Navbar.Brand>
                </Navbar>
                <Form style={{display: "block", marginLeft: "auto", marginRight: "auto", paddingTop: "20vh", width: "300px",boxShadow: "2px 2px #c7c7c7", borderStyle: "solid", borderWidth: "1px", borderRadius: "15px", borderColor: "#a4a4a4", backgroundColor: "#fafafa", padding: "40px", marginTop: "23vh"}}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label style={{display: "block", textAlign: "center"}}>Username</Form.Label>
                        <Form.Control type="text" placeholder="Your domain username" onChange={this.usernameChange} value={this.state.username} isInvalid={this.state.showInvalidU}/>
                        {   !this.state.showErr
                            ? <><Form.Text className="text-muted">Enter valid domain username</Form.Text></>
                            : null
                        }                        
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label style={{display: "block", textAlign: "center"}}>Password</Form.Label>
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

export default withRouter(Login);
