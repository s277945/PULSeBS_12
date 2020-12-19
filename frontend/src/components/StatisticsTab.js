import React, { Component } from 'react'
import { getCourseStats, getWeekStats, getMonthStats } from '../api/api'
import { ResponsiveBar } from "@nivo/bar";
import Table from 'react-bootstrap/Table'
import moment from 'moment'
import { Checkbox } from 'pretty-checkbox-react';


export class StatisticsTab extends Component {

    //GB Lectures as first option
    constructor() {
        super();
        this.state = { selected: [], lectures: [], week: [], month: [], groupBy: "Lectures", labels: true, width: window.innerWidth}
        this.handleResize = this.handleResize.bind(this);
    }
    
    componentDidMount() {
        window.addEventListener("resize", this.handleResize);
        getCourseStats(this.props.course.CourseID)
            .then(res => {
                //We update selected data as CourseStats (Lectures) is the first option
                this.setState({ lectures: res.data }, this.updateSelected);
            }).catch(/* istanbul ignore next */err => {
                console.log(err);
            });

        getWeekStats(this.props.course.CourseID)
            .then(res => {
                let neweek = [];
                if (res.data) neweek = res.data.sort((w1,w2)=>{
                    let a = moment(w1.startDate, "YYYY/MM/DD");
                    let b = moment(w2.startDate, "YYYY/MM/DD");
                    return a.diff(b, 'days');
                }).map((w)=>{
                    return { average: w.average?(Math.floor(w.average)===w.average?Math.floor(w.average):w.average.toFixed(2)):w.average,
                             averageAtt: w.averageAtt?(Math.floor(w.averageAtt)===w.averageAtt?Math.floor(w.averageAtt):w.averageAtt.toFixed(2)):w.averageAtt, 
                             weekName: w.weekName, startDate: w.startDate, endDate: w.endDate };// truncate floating point to second digit
                });
                this.setState({ week: neweek });
            }).catch(/* istanbul ignore next */err => {
                console.log(err);
            });

        getMonthStats(this.props.course.CourseID)
            .then(res => {
                let newmonth = [];
                if (res.data) newmonth=res.data.sort((m1,m2)=>{
                    let a = moment(m1.month+"/"+m1.year, "MMMM/YYYY");
                    let b = moment(m2.month+"/"+m2.year, "MMMM/YYYY");
                    return a.diff(b, 'days');
                }).map((m)=>{
                    return { average: m.average?(Math.floor(m.average)===m.average?Math.floor(m.average):m.average.toFixed(2)):m.average,
                        averageAtt: m.averageAtt?(Math.floor(m.averageAtt)===m.averageAtt?Math.floor(m.averageAtt):m.averageAtt.toFixed(2)):m.averageAtt, 
                        month: m.month, year: m.year };// truncate floating point to second digit
                });
                this.setState({ month: newmonth });
            }).catch(/* istanbul ignore next */err => {
                console.log(err);
            });

    }

    componentWillUnmount() {
        window.addEventListener("resize", null);
    }
    
    handleResize(WindowSize, event) {
        console.log(window.innerWidth);
        this.setState({width: window.innerWidth})
    }

    updateSelected = () => {
        switch (this.state.groupBy) {

            case "Week":
                this.setState({ selected: this.state.week })
                break

            case "Lectures":
                this.setState({ selected: this.state.lectures })
                break

            case "Month":
                this.setState({ selected: this.state.month })
                break

            default:
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
                                        <th style={{textAlign: "center", width: "48px"}}>{beginning.format("DD/MM")+"-"+end.format("DD/MM")}</th>
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
                                            <td>{lecture.lectureName.substr(lecture.lectureName.indexOf('Les'))}</td>
                                            <td>{moment(lecture.date).format("DD/MM/YYYY HH:mm")}</td>
                                            <td>{lecture.nBooked}</td>
                                            <td>{lecture.nAttendance}</td>
                                        </tr>                                
                                    )})}
                                    <tr>
                                            <td></td>
                                            <td></td>
                                            <th>Average</th>
                                            <td>{w.average}</td>
                                            <td>{w.averageAtt}</td>
                                        </tr>    
                                </tbody>
                            </Table>
                            );
                            else return(<div></div>);
                        })}
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
                                <td>{lecture.lectureName.substr(lecture.lectureName.indexOf('Les'))}</td>
                                <td>{moment(lecture.date).format("DD/MM/YYYY HH:mm")}</td>
                                <td>{lecture.nBooked}</td>
                                <td>{lecture.nAttendance}</td>
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
                                    <th style={{textAlign: "center", width: "48px"}}>{monthdate.format("MM/YYYY")}</th>
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
                                        <td>{lecture.lectureName.substr(lecture.lectureName.indexOf('Les'))}</td>
                                        <td>{moment(lecture.date).format("DD/MM/YYYY HH:mm")}</td>
                                        <td>{lecture.nBooked}</td>
                                        <td>{lecture.nAttendance}</td>
                                    </tr>                                
                                )})}
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <th>Average</th>
                                    <td>{m.average}</td>
                                    <td>{m.averageAtt}</td>
                                </tr>
                            </tbody>
                        </Table>
                        );
                        else return(<div></div>);
                    })}
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
                keys = ["Average booked seats", "Average attendees"]
                indexBy = "weekName"
                break

            case "Lectures":
                keys = ["Booked seats", "Attendees"]
                indexBy = "lectureName"
                break

            case "Month":
                keys = ["Average booked seats", "Average attendees"]
                indexBy = "month"
                break

            default:
                break;
        }


        return (
            <div ref={this.myInput}>
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
                    <div style={{ height: "400px"}}>
                        <ResponsiveBar
                            // margin needed to show axis labels
                            margin={{
                                "top": 50,
                                "right": 60,
                                "bottom": 50,
                                "left": 60
                            }}

                            //set colors
                            animate={true}
                            colorBy={d=>{
                                if(d.id==="Booked seats") return d.indexValue;
                                if(d.id==="Average attendees") return d.index;
                                return d.value;
                            }}
                            colors={{ scheme: "nivo" }}
                            groupMode="grouped"
                            label={d =>{
                                let c=14/Math.ceil(Math.log(d.value + 1) / Math.LN10);
                                if((d.id==="Booked seats"||d.id==="Attendees")){
                                    if (d.value!==0) return <tspan><tspan>{d.value}</tspan><tspan text-anchor="middle" y={ -5 } dx={-19+c}>{ this.state.labels?d.id.toLowerCase():"" }</tspan></tspan>;
                                    else return;
                                }
                                else if((d.id==="Average booked seats"||d.id==="Average attendees")){
                                    let substr=d.id.split(" ");
                                    if (d.value!==0&&Math.floor(d.value)!==d.value) return <tspan><tspan>{d.value}</tspan><tspan text-anchor="middle" y={ -15 } dx={-35+c}>{ this.state.labels?substr[0].toLowerCase():"" }</tspan><tspan text-anchor="middle" y={ -5 } dx={substr[2]?(-46+c):(-54+c)}>{this.state.labels?(substr[2]?substr[1]+" "+substr[2]:substr[1]):""}</tspan></tspan>;
                                    else if(d.value!==0&&Math.floor(d.value)===d.value) return <tspan><tspan>{d.value}</tspan><tspan text-anchor="middle" y={ -15 } dx={-19+c}>{ this.state.labels?substr[0].toLowerCase():"" }</tspan><tspan text-anchor="middle" y={ -5 } dx={substr[2]?(-46+c):(-40+c)}>{this.state.labels?(substr[2]?substr[1]+" "+substr[2]:substr[1]):""}</tspan></tspan>;
                                    else return;
                                }
                                else return d.value;
                            }}
                            labelSkipWidth={85}
                            // Chart options
                            data={this.state.selected.map(e=>{
                                if(typeof e.month !=="undefined") return {"Average booked seats": e.average, "Average attendees": e.averageAtt, "month": e.month};
                                else if(typeof e.endDate !=="undefined") return {"Average booked seats": e.average, "Average attendees": e.averageAtt, "weekName": e.weekName};
                                else if(typeof e.date !=="undefined"){return {"date": e.date, "lectureName": e.lectureName.substr(e.lectureName.indexOf('Les')), "Booked seats": e.nBooked, "Attendees": e.nAttendance};}
                                else return e;
                            })}
                            margin={{bottom: 35, left: 60, right: 60, top: 50}}
                            keys={keys}
                            indexBy={indexBy}

                        />
                    </div>
                    {this.state.width>=970?(this.state.groupBy!=="Week"?
                        <div style={{display:"flex", justifyContent:"flex-end", marginBottom: "20px", color: "#222222"}}>
                            <Checkbox style={{marginRight: "5px", marginBottom:"1px"}} id={`label-checkbox`} checked={this.state.labels} onClick={()=>{this.setState({labels: !this.state.labels})}}/>
                            <div style={{fontSize:"14px", marginRight: "63px"}}>enable labels</div>
                        </div>
                        :
                        <div style={{display:"flex", justifyContent:"flex-end", marginBottom: "20px", color: "#a2a2a2"}}>
                            <Checkbox disabled style={{marginRight: "5px", marginBottom:"1px"}} id={`label-checkbox`} checked={this.state.labels} onClick={()=>{this.setState({labels: !this.state.labels})}}/>
                            <div style={{fontSize:"14px", marginRight: "63px"}}>enable labels</div>
                        </div>)
                        :<div style={{marginBottom: "10px"}}/>
                    }
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
