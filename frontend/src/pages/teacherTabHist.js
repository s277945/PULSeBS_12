import React, { Component } from 'react'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { Form } from 'react-bootstrap';
import update from './update.js'
import axios from 'axios'


export class TeacherTabHist extends Component {

    state = { tableData: [], statistics: [], course: null, startDate: null, endDate: null, groupBy: "Total" }

    componentDidMount() {
        update(this)
    }

    showResults = (e) => {
        e.preventDefault();
        //Todo, exe only if values different than null

        //This is for total, todo for week and month

        //Note that hours sent to server are fixed
        axios.get(`http://localhost:3001/api/historicalStats/${this.state.course}?dateStart=${this.state.startDate} 00:00:00&dateEnd=${this.state.endDate} 24:00:00`, { withCredentials: true })
            .then(res => {
                console.log(res.data);
                if(res.data===null)
                    this.setState({ statistics: 0 })
                else
                    this.setState({ statistics: res.data })
            }).catch(err => {
                console.log(err);
            });

    }

    render() {

        //Get unique values from lectures, i.e courses
        let courses = [...new Set(this.state.tableData.map(item => item.Course_Ref))];

        return (
            <div><h1 className="page-title">Historical Data</h1>

                <div className="row">

                    <div className="col-md-2">
                        <p>Select Course</p>
                        <select className="browser-default custom-select "
                            onChange={(e) => { this.setState({ course: e.target.value }) }}>
                            <option disabled selected>Select Course</option>
                            {courses.map((course) => <option value={course}>{course}</option>)}
                        </select></div>

                    <div className="col-md-2">
                        <Form.Group controlId="dob">
                            <Form.Label>From</Form.Label>
                            <Form.Control type="date" name="dob" placeholder="Date of Birth"
                                onChange={(e) => { this.setState({ startDate: e.target.value }) }} />
                        </Form.Group>
                    </div>

                    <div className="col-md-2">
                        <Form.Group controlId="dob">
                            <Form.Label>Until</Form.Label>
                            <Form.Control type="date" name="dob" placeholder="Date of Birth"
                                onChange={(e) => { this.setState({ endDate: e.target.value }) }} />
                        </Form.Group>
                    </div>

                    <div className="col-md-2">
                        <p>Group by</p>
                        <select className="browser-default custom-select"
                            onChange={(e) => { this.setState({ groupBy: e.target.value }) }}>
                            <option value="Total">Total</option>
                        </select></div>

                    <div><Button onClick={this.showResults}>Show</Button></div>

                </div>
                <p>{this.state.groupBy} Statistics:</p>
                {this.state.statistics}
            </div>
        )
    }
}