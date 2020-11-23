import React from "react";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'

export default function Calendar({lectures}){
    const events = lectures.map(lecture => {
        return{
            title: lecture.Name,
            date: lecture.Date
        }
    })

    return(
            <FullCalendar
                plugins={[ dayGridPlugin ]}
                initialView="dayGridMonth"
                events={events}
                locale="it"
            />
    )
}