import React, { Component } from 'react'
import {StatisticsTab} from '../components/StatisticsTab'
import { getTeacherCourses } from '../api/api'


export class TeacherTabHist extends Component {

    state = { tableData: [], statistics: [], course: null, startDate: null, endDate: null, groupBy: "Total" }

    componentDidMount() {// get courses from server
        let courses = [];
        getTeacherCourses()
             .then(res => {
                 console.log(res.data);
                 courses = res.data;
                 console.log(courses);
                 this.setState({ tableData: courses });
             }).catch(/* istanbul ignore next */err=>{
                 console.log(err);
              });
    }


    render() {

        return (
            <div  className="app-element-background"><br></br><h1 className="page-title">Historical Data</h1><br></br>
                {this.state.tableData.map((course) => <div style={{margin: "10px", border: "2px solid gray", borderRadius: "11px", padding: "17px"}}><StatisticsTab course={course}></StatisticsTab></div>)}
            </div>
        )
    }
}