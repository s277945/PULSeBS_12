import React, { Component } from 'react'
import { TeacherTabSL } from './teacherTabSL'

export class TeacherHome extends Component {


    componentDidMount() {
        // check if session is stared, otherwise return to login

    }


    render() {

        return (
            <div>Teachers Home <p>Navbar here</p>
                <TeacherTabSL></TeacherTabSL>
            </div>
        )
    }
}