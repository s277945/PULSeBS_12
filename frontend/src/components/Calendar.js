import React from "react";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import moment from 'moment'

function renderEventContent(arg) {
    console.log(arg);
    return (
        <>
            <div className="fc-event-main" style={{display: "block",width:"100%",backgroundColor:arg.backgroundColor, wrap: "nowrap",overflow:"auto"
            }}>
                <div style={{color:"#FFFFFF",marginLeft:"2px"}}>
                    <b>{arg.event.extendedProps.lectureName}</b>
                </div>
                <div style={{color:"#FFFFFF",marginLeft:"2px"}}>
                    {arg.event.extendedProps.courseName}
                </div>
                <div style={{color:"#FFFFFF",marginLeft:"2px"}}>
                    {moment(arg.event.start).format("HH:mm")+" - "+moment(arg.event.end).format("HH:mm")}
                </div>

            </div>

        </>
    )
}

var stringToColour = function(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);// generate color from course name hash
    }
    var colour = '#';
    for (i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 0xff;
        if(i===0) value=(value*70/100)  & 0xff;// set red brightness
        if(i===1) value=(value*80/100)  & 0xff;// set green brightness
        if(i===2) value=(value*90/100)  & 0xff;// set blue brightness
        colour += ('00' + value.toString(16)).substr(-2);// add primary color to final color string
    }
    return colour;
}
export default function Calendar({lectures,courses}){
    const events = lectures.map(lecture => {
        //generate a color based on hash
        let course=courses.filter(course1=>course1.CourseID===lecture.Course_Ref)[0];

        let color=stringToColour(course.Name);
        return{
            extendedProps:{
                lectureName: lecture.Name,
                courseName:course.Name,
                lectureType:lecture.Type
            },
            html:true,
            content:lecture.Name,
            start: lecture.Date,
            end: lecture.EndDate,
            color:color
        }
    })

    return(
        <FullCalendar tour-selec="calendar"
            plugins={[ dayGridPlugin,timeGridPlugin ]}
            initialView="timeGridWeek"
            weekends={false}
            headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek'
            }}
            events={events}
            locale="it"
            slotMinTime={"08:00:00"}
            slotMaxTime={"22:00:00"}
            slotEventOverlap={false}
            eventContent={renderEventContent}
        />
    )
}
