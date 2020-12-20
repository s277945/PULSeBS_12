import React, { Component } from 'react'
import { TeacherTabSL } from './teacherTabSL'
import { TeacherTabLec } from './teacherTabLec'
import  TeacherNavbar  from './teacherNavbar'
import {authContext} from '../components/Authsystem'
import { TeacherTabHist } from './teacherTabHist'

export class TeacherHome extends Component {
    static contextType = authContext

    state = {
        show : 0 //This state variable is used to choose the content to show
    }

    componentDidMount() {
        let pagestate = sessionStorage.getItem("pagestate");//get saved state value
        let redir = sessionStorage.getItem("redir");//get saved redir value
        if(pagestate!==null) this.setState({show : parseInt(pagestate, 10)});
        else sessionStorage.setItem("pagestate", 0);//if none is present, save state value
        if(redir===null) sessionStorage.setItem("redir", this.context.user.userName);//if none is present, set new redir value
    }
    //Function to set the show variable
    setShow = (val) => {
        this.setState({show : val});
    }

    //Function that displays the correct content based on this.state.show
    contentSelect = () => {
        if (this.state.show === 0) return (
            <div className="app-background">
                <TeacherTabLec history={this.props.history}></TeacherTabLec>
            </div>
        )

        if (this.state.show === 1) return (
            <div className="app-background">
                <TeacherTabSL history={this.props.history}></TeacherTabSL>
            </div>
        )

        if (this.state.show === 2) return (
            <div className="app-background">
                <TeacherTabHist history={this.props.history}></TeacherTabHist>
            </div>
        )
        /* istanbul ignore else */
        else{
            return (
                <div>

                </div>
            )
        }
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
