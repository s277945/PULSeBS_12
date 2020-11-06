import React, { Component } from 'react'
import axios from 'axios';
import Form from 'react-bootstrap/Form'

export class Login extends Component {
    state = {
        username: "",
        password: ""
    }

    componentDidMount(){
    
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

    render() {

        return (
            <div>
                <Form>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" placeholder="Enter username" onChange={this.usernameChange} value={this.state.username}/>
                        <Form.Text className="text-muted">
                            Enter valid domain username
                        </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" onChange={this.passwordChange} value={this.state.password}/>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </div>
        )
    }
}
