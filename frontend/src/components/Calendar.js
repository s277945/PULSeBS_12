import React from "react";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'

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
export default function Calendar({lectures}){
    const events = lectures.map(lecture => {
        //generate a color based on hash
        let array=lecture.Name.split(" ");
        let lectureId=array[0];
        let color=stringToColour(lectureId);

        return{
            title: lecture.Name,
            start: lecture.Date,
            end: lecture.EndDate,
            color: color
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
                eventColor={"#204001"}
            />
    )
}
