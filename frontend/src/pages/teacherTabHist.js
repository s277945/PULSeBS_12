import React, { Component } from 'react'
import update from './update.js'
import {StatisticsTab} from '../components/StatisticsTab'


export class TeacherTabHist extends Component {

    state = { tableData: [], statistics: [], course: null, startDate: null, endDate: null, groupBy: "Total" }

    componentDidMount() {
        update(this)
    }


    render() {

        //Get unique values from lectures, i.e courses
        let courses = [...new Set(this.state.tableData.map(item => item.Course_Ref))];

        return (
            <div><br></br><h1 className="page-title">Historical Data</h1><br></br>
                {courses.map((course) => <div style={{margin: "10px", border: "2px solid gray", borderRadius: "11px", padding: "17px"}}><StatisticsTab course={course}></StatisticsTab></div>)}
            </div>
        )
    }
}