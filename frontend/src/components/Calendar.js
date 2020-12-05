import React from "react";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import moment from 'moment'


var stringToColour = function(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = '#';
    for (var i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 0xff;
        value=(value+0x8f)& 0xff;
        colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
}
export default function Calendar({lectures,courses}){
    const events = lectures.map(lecture => {
        //generate a color based on hash
        let course=courses.filter(courses=>courses.CourseID===lecture.Course_Ref)[0];

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
            color: color,

        }
    })

    return(
            <FullCalendar

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
                eventContent={function(arg, createElement) {
                    let children=[];
                    if (arg.event.extendedProps) {
                        let elem4=createElement('div',{},moment(arg.event.start).format("HH:mm")+" - "+moment(arg.event.end).format("HH:mm"));
                        let elem1=createElement('div',{},arg.event.extendedProps.lectureName+" / "+(arg.event.extendedProps.lectureType==='p'?'Presence':'Virtual Classroom'));
                        let elem2=createElement('b',{},arg.event.extendedProps.courseName);
                        children=[elem2,elem1,elem4];
                    }
                    createElement()
                    return createElement('div', {}, children);
                }}
            />
    )
}
