import React, { Component } from 'react'
import { StudentNavbar } from './studentNavbar'

export class StudentHome extends Component {
    state = {
        show : 0 //this state variable is used to choose the content to show
    }

    setShow = (val) => { //function to set the show variable
        this.setState({show : val});
    }

    contentSelect = () => { //function that displays the correct content based on this.state.show
        if (this.state.show === 0) return (
            <div>
                {/*lecture content displayed here*/}
            </div>
        )
        else return (
            <div>

            </div>
        )
    }
    render() {
        return (
            <>
                <StudentNavbar setShow={this.setShow} history={this.props.history} context={this.props.context}/>
                {this.contentSelect()}
            </>
        )
    }
}
