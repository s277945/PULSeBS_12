import React from "react";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'

export default function Calendar({lectures}){
    const events = lectures.map(lecture => {
        return{
            title: lecture.Name,
            start: lecture.Date,
            end: lecture.EndDate
        }
    })

    return(
            <FullCalendar

                plugins={[ dayGridPlugin,timeGridPlugin ]}
                initialView="timeGridWeek"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek'
                }}
                events={events}
                locale="it"
            />
    )
}