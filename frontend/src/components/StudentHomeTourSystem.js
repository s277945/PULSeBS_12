import React, { useState, useContext, createContext } from 'react'
import Tour from 'reactour'

export const TourContext = createContext();

export default function StudentHomeTour(props){
    const [isTourOpen, setIsTourOpen] = useState(true);

    const tour = {
        isTourOpen: isTourOpen,
        setIsTourOpen: setIsTourOpen
    }

    return (
        <TourContext.Provider value={tour}>
            <Tour
            steps={steps}
            isOpen={isTourOpen}
            onRequestClose={() => setIsTourOpen(false)}
            badgeContent={(curr, tot) => `${curr} of ${tot}`} 
            rounded={5}
            />
            {props.children}
        </TourContext.Provider>
    )
  };

const steps = [
    {
        selector: '[tour-selec="navbar"]',
        content: 'You can change between lectures/calendar view in the nav bar',
    },
];


        // BookedSeats: 1
        // Capacity: 100
        // Course_Ref: "C2468"
        // Date: "2021-03-08 15:00:00"
        // DateDeadline: "2021-03-07 23:00:00"
        // EndDate: "2021-03-08 18:00:00"
        // Name: "WA Les:3"
        // Type: "p"
        // alreadyBooked: true
export const tourLecture = [
    {
        Name: "Lecture1",
        Type: "p",
        Date: new Date()
    }
]