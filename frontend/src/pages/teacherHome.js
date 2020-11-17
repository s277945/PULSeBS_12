import React, { Component } from 'react'
import { TeacherTabSL } from './teacherTabSL'
import { TeacherTabLec } from './teacherTabLec'
import { TeacherNavbar } from './teacherNavbar'

export class TeacherHome extends Component {
    state = {
        show : 0 //This state variable is used to choose the content to show
    }

    componentDidMount() {
        if(!this.props.context.userName || this.props.context.userType!=='t') this.props.history.push("/"); //open page only if a valid session has been started

    }

    //Function to set the show variable
    setShow = (val) => { 
        this.setState({show : val});
    }
    
    //Function that displays the correct content based on this.state.show
    contentSelect = () => { 
        if (this.state.show === 0) return (
            <div class="app-background">
                <br></br>
                <p>next lecture info</p>
                <TeacherTabLec history={this.props.history} context={this.props.context}></TeacherTabLec>
            </div>
        )
        
        if (this.state.show === 1) return (
            <div class="app-background">
                <TeacherTabSL history={this.props.history} context={this.props.context}></TeacherTabSL>
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