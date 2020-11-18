import React, { Component } from 'react'
import { TeacherTabSL } from './teacherTabSL'
import { TeacherTabLec } from './teacherTabLec'
import  TeacherNavbar  from './teacherNavbar'
import {authContext} from '../components/Authsystem'

export class TeacherHome extends Component {
    static contextType = authContext

    state = {
        show : 0 //This state variable is used to choose the content to show
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
                <TeacherTabLec history={this.props.history}></TeacherTabLec>
            </div>
        )
        
        if (this.state.show === 1) return (
            <div class="app-background">
                <TeacherTabSL history={this.props.history}></TeacherTabSL>
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
                <TeacherNavbar setShow={this.setShow}/>
                {this.contentSelect()}
                
            </div>
        )
    }
}