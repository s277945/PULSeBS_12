import React, { Component } from 'react'
import { getCourseStats, getWeekStats, getMonthStats } from '../api/api'
import { ResponsiveBar } from "@nivo/bar";



export class StatisticsTab extends Component {

    //GB Lectures as first option
    state = { selected: [], lectures: [], week: [], month: [], groupBy: "Lectures" }

    componentDidMount() {

        getCourseStats(this.props.course)
            .then(res => {
                //We update selected data as CourseStats (Lectures) is the first option
                this.setState({ lectures: res.data }, this.updateSelected);
            }).catch(/* istanbul ignore next */err => {
                console.log(err);
            });

        getWeekStats(this.props.course)
            .then(res => {
                this.setState({ week: res.data });
            }).catch(/* istanbul ignore next */err => {
                console.log(err);
            });

        getMonthStats(this.props.course)
            .then(res => {
                this.setState({ month: res.data });
            }).catch(/* istanbul ignore next */err => {
                console.log(err);
            });

    }

    updateSelected = () => {
        switch (this.state.groupBy) {

            case "Week":
                console.log("case Week")
                this.setState({ selected: this.state.week })
                break

            case "Lectures":
                console.log("case Lectures")
                this.setState({ selected: this.state.lectures })
                break

            case "Month":
                console.log("case Month")
                this.setState({ selected: this.state.month })
                break

        }
    }

    //function that renders statistics chart
    renderChart = () => {
        let gbOptions = ["Lectures", "Week", "Month"]



        let keys = ""
        let indexBy = ""

        //Select options for chart, because data fields are different
        switch (this.state.groupBy) {

            case "Week":
                keys = "average"
                indexBy = "weekName"
                break

            case "Lectures":
                keys = "nBooked"
                indexBy = "lectureName"
                break

            case "Month":
                keys = "average"
                indexBy = "month"
                break
        }


        return (
            <div>
                <div style={{display: "flex", wrap: "nowrap", justifyContent: "space-between"}}>

                    <div data-testid={"courseStat"} style={{ marginLeft: "10px"}}>
                        <p style={{fontSize: "23px"}}>Course: {this.props.course}</p>
                    </div>

                    <div style={{display: "flex", wrap: "nowrap", marginTop: "1px", marginRight: "7px"}}>
                        <p style={{fontSize: "21px", minWidth: "110px", marginRight: "10px"}}>Detail level: </p>
                    

                        <select className="browser-default custom-select "
                            //On change we update the selected groupBy and call updateSelected as a callback
                            onChange={(e) => { this.setState({ groupBy: e.target.value }, this.updateSelected); }}>
                            {gbOptions.map((groupBy) => <option value={groupBy}>{groupBy}</option>)}
                        </select>
                    </div>
                </div>

                <div style={{ height: "400px" }}>
                    <ResponsiveBar
                        // margin needed to show axis labels
                        margin={{
                            "top": 50,
                            "right": 60,
                            "bottom": 50,
                            "left": 60
                        }}

                        //set colors
                        colorBy="index"
                        colors={{ scheme: "nivo" }}

                        // Chart options
                        data={this.state.selected}
                        keys={[keys]}
                        indexBy={indexBy}
                    /></div>

            </div>
        )
     }

    render() {


        return (
            <>
                {this.renderChart()}
           </>
        )
    }
}
