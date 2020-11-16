import React, { Component } from 'react'
import { TeacherTabSL } from './teacherTabSL'
import { TeacherTabLec } from './teacherTabLec'
import { TeacherNavbar } from './teacherNavbar'

export class TeacherHome extends Component {
    state = {
        show : 0 //this state variable is used to choose the content to show
    }

    componentDidMount() {
        if(!this.props.context.userName || !this.props.context.userType || this.props.context.userType!=='t') this.props.history.push("/"); //open page only if a valid session has been started

    }

    setShow = (val) => { //function to set the show variable
        this.setState({show : val});
    }

    contentSelect = () => { //function that displays the correct content based on this.state.show
        if (this.state.show === 0) return (
            <div class="app-background">
                <br></br>
                <p>next lecture info</p>
                <TeacherTabLec></TeacherTabLec>
            </div>
        )
        
        if (this.state.show === 1) return (
            <div class="app-background">
                <TeacherTabSL></TeacherTabSL>
            </div>
        )

        else return (
            <div>
                
            </div>
        )
    }

    render() {

        return (
            <div>
                <TeacherNavbar setShow={this.setShow} history={this.props.history} context={this.props.context}/>
                {this.contentSelect()}
                
            </div>
        )
    }
}