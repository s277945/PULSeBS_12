import React, { Component } from 'react'
import { TeacherTabSL } from './teacherTabSL'

export class TeacherHome extends Component {


    componentDidMount() {
        if(!this.props.context.userName || !this.props.context.userType) this.props.history.push("/"); //open page only if a valid session has been started

    }


    render() {

        return (
            <div>Teachers Home <p>Navbar here</p>
                <TeacherTabSL></TeacherTabSL>
            </div>
        )
    }
}