import React, { Component } from 'react'
import { TeacherTabSL } from './teacherTabSL'
import { TeacherTabLec } from './teacherTabLec'
import TeacherNavbar from './teacherNavbar'
import { authContext } from '../components/Authsystem'
import { TeacherTabHist } from './teacherTabHist'

import { TeacherHistTour, TeacherLecTour, TeacherSLTour } from "../components/TeacherTours";
import { TeacherHistTourContext, TeacherLecTourContext, TeacherSLTourContext } from "../components/TeacherTours";

export class TeacherHome extends Component {
    static contextType = authContext

    state = {
        show: 0 //This state variable is used to choose the content to show
    }

    componentDidMount() {
        let pagestate = sessionStorage.getItem("pagestate");//get saved state value
        let redir = sessionStorage.getItem("redir");//get saved redir value
        if (pagestate !== null) this.setState({ show: parseInt(pagestate, 10) });
        else sessionStorage.setItem("pagestate", 0);//if none is present, save state value
        if (redir === null) sessionStorage.setItem("redir", this.context.user.userName);//if none is present, set new redir value
    }
    //Function to set the show variable
    setShow = (val) => {
        this.setState({ show: val });
    }

    //Function that displays the correct content based on this.state.show
    contentSelect = () => {
        if (this.state.show === 0) return (
            <div className="app-background">
                <TeacherLecTourContext.Consumer>{tour =>
                    <TeacherTabLec history={this.props.history} tour={tour}></TeacherTabLec>
                }
                </TeacherLecTourContext.Consumer>

            </div>
        )

        if (this.state.show === 1) return (
            <div className="app-background">
                
                <TeacherSLTourContext.Consumer>{tour =>
                    <TeacherTabSL history={this.props.history} tour={tour}></TeacherTabSL>
                }
                </TeacherSLTourContext.Consumer>
            </div>
        )
        /* istanbul ignore else */
        if (this.state.show === 2) return (
            <div className="app-background">
                <TeacherHistTourContext.Consumer>{tour =>
                    <TeacherTabHist history={this.props.history} tour={tour}></TeacherTabHist>
                }
                </TeacherHistTourContext.Consumer>
            </div>
        )
        /* istanbul ignore else */
        else {
            return (
                <div>

                </div>
            )
        }
    }

    render() {

        return (
            <div>
                <TeacherNavbar setShow={this.setShow} show={this.state.show} />
                {this.contentSelect()}

            </div>
        )
    }
}

//Subscribe Teacher home and it's children to the 3 contexts, one for each tour
const TourContextWrapper = () => {
    return (
        <TeacherLecTour>
            <TeacherHistTour>
                <TeacherSLTour>
                    <TeacherHome />
                </TeacherSLTour>
            </TeacherHistTour>
        </TeacherLecTour>
    )
}

export default TourContextWrapper