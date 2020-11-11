import React, { Component } from 'react'
import { StudentNavbar } from './studentNavbar'

export class StudentHome extends Component {
    state = {
        show : 0
    }

    setShow = (val) => {
        this.setState({show : val});
    }

    contentSelect = () => {
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
