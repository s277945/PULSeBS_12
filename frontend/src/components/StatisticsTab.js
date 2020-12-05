import React, { Component } from 'react'
import { getCourseStats, getWeekStats, getMonthStats } from '../api/api'
import { ResponsiveBar } from "@nivo/bar";
import Table from 'react-bootstrap/Table'
import moment from 'moment'



export class StatisticsTab extends Component {

    //GB Lectures as first option
    state = { selected: [], lectures: [], week: [], month: [], groupBy: "Lectures" }

    componentDidMount() {

        getCourseStats(this.props.course.CourseID)
            .then(res => {
                //We update selected data as CourseStats (Lectures) is the first option
                this.setState({ lectures: res.data }, this.updateSelected);
            }).catch(/* istanbul ignore next */err => {
                console.log(err);
            });

        getWeekStats(this.props.course.CourseID)
            .then(res => {
                this.setState({ week: res.data });
                let neweek = this.state.week.sort((w1,w2)=>{
                    let a = moment(w1.startDate, "YYYY/MM/DD");
                    let b = moment(w2.startDate, "YYYY/MM/DD");
                    return a.diff(b, 'days');
                }).map((w)=>{
                    if(w.average) return { average: w.average.toFixed(2), weekName: w.weekName, startDate: w.startDate, endDate: w.endDate};// truncate floating point to second digit
                    else return w;
                });
                this.setState({ week: neweek });
            }).catch(/* istanbul ignore next */err => {
                console.log(err);
            });

        getMonthStats(this.props.course.CourseID)
            .then(res => {
                this.setState({ month: res.data });
                let newmonth = this.state.month.sort((m1,m2)=>{
                    let a = moment(m1.month+"/"+m1.year, "MMMM/YYYY");
                    let b = moment(m2.month+"/"+m2.year, "MMMM/YYYY");
                    return a.diff(b, 'days');
                }).map((m)=>{
                    if(m.average) return { average: m.average.toFixed(2), month: m.month, year: m.year};// truncate floating point to second digit
                    else return m;
                });
                this.setState({ month: newmonth });
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

    //function that renders statistics table
    renderTable = () => {
        switch (this.state.groupBy) {

            case "Week":
                return (
                    <div>
                        {this.state.week.map((w)=>{ // map each week to a possible table
                            let beginning = moment(w.startDate, "YYYY/MM/DD");// read week beginning date
                            let end = moment(w.endDate, "YYYY/MM/DD");//read week end beginning date
                        let lectures = this.state.lectures.filter((lecture)=>{return moment(lecture.date).isSameOrAfter(beginning)&&moment(lecture.date).isSameOrBefore(end)})// get lectures within week
                        if (Array.isArray(lectures)&&lectures.length>0) return (// check if there are lectures, otherwise nothing is returned
                            <Table striped bordered hover style={{backgroundColor: "#fff"}} key={w.weekName}>
                            <thead>
                                <tr>
                                    <th style={{textAlign: "center", maxWidth: "48px"}}>{beginning.format("DD/MM")+"-"+end.format("DD/MM")}</th>
                                    <th>Lecture name</th>
                                    <th>Date and time</th>
                                    <th>Booked seats</th>
                                    <th>Attendees</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lectures.map((lecture)=>{ return (    // map lecture to table row                        
                                    <tr>
                                        <td></td>
                                        <td>{lecture.lectureName}</td>
                                        <td>{moment(lecture.date).format("DD/MM/YYYY HH:mm")}</td>
                                        <td>{lecture.nBooked}</td>
                                        <td>/</td>
                                    </tr>                                
                                )})}
                            </tbody>
                        </Table>
                        );})}
                    </div>
                );

            case "Lectures":
                return (
                    <Table striped bordered hover style={{ backgroundColor: "#fff"}}>
                        <thead>
                            <tr>
                                <th>Lecture name</th>
                                <th>Date and time</th>
                                <th>Booked seats</th>
                                <th>Attendees</th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.state.lectures.map((lecture)=>{ return (    // map lecture to table row                               
                            <tr>
                                <td>{lecture.lectureName}</td>
                                <td>{moment(lecture.date).format("DD/MM/YYYY HH:mm")}</td>
                                <td>{lecture.nBooked}</td>
                                <td>/</td>
                            </tr>                                
                        )})}
                        </tbody>
                    </Table>
                );

            case "Month":
                return (
                    <div>
                    {this.state.month.map((m)=>{ // map each month to a possible table
                        let monthdate = moment(m.month+"/"+m.year.toString(), "MMMM/YYYY")// init month date
                    let lectures = this.state.lectures.filter((lecture)=>{return moment(lecture.date).isSame(monthdate, 'month')})// get lectures within month
                    if (Array.isArray(lectures)&&lectures.length>0) return (// check if there are lectures, otherwise nothing is returned
                        <Table striped bordered hover style={{backgroundColor: "#fff"}} key={monthdate}>
                        <thead>
                            <tr>
                                <th style={{textAlign: "center", maxWidth: "48px"}}>{monthdate.format("MM/YYYY")}</th>
                                <th>Lecture name</th>
                                <th>Date and time</th>
                                <th>Booked seats</th>
                                <th>Attendees</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lectures.map((lecture)=>{ return (    // map lecture to table row                        
                                <tr>
                                    <td></td>
                                    <td>{lecture.lectureName}</td>
                                    <td>{moment(lecture.date).format("DD/MM/YYYY HH:mm")}</td>
                                    <td>{lecture.nBooked}</td>
                                    <td>/</td>
                                </tr>                                
                            )})}
                        </tbody>
                    </Table>
                    );})}
                </div>
            );
            default:
                return (<div></div>);
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

            default:
                break;
        }


        return (
            <div>
                <div style={{display: "flex", wrap: "nowrap", justifyContent: "space-between"}}>

                    <div data-testid={"courseStat"} style={{display: "flex", wrap: "nowrap", marginLeft: "10px"}}>
                        <p style={{fontSize: "23px"}}>Course:</p> <p style={{fontWeight: "bold", fontSize: "23px", marginLeft: "10px"}}>{this.props.course.Name+" ("+this.props.course.CourseID+")"}</p>
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
                
                <div >
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
                        />
                    </div>
                    <div style={{margin: "10px", marginLeft: "35px", marginRight: "37px"}}>
                        {this.renderTable()}
                    </div>
                </div>
                
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
