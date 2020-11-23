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
                initialView="dayGridWeek"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,dayGridWeek'
                }}
                events={events}
                locale="it"
            />
    )
}