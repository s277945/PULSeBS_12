import React, { useState, useContext, createContext } from 'react'
import { setTutorial } from '../api/api'
import { ProvideAuth } from '../components/Authsystem'
import Tour from 'reactour'

export const TourContext = createContext();

export default function StudentHomeTour(props){
    const [isTourOpen, setIsTourOpen] = useState(true);

    
    {
        if(localStorage.getItem("tutorial") == 1 && !localStorage.getItem("willingNewTutorial") && isTourOpen === true) setIsTourOpen(false)

    }
    
    const tour = {
        isTourOpen: isTourOpen,
        setIsTourOpen: setIsTourOpen
    }

    return (
        <TourContext.Provider value={tour}>
            <Tour
            steps={steps}
            isOpen={isTourOpen}
            onRequestClose={() => {
                setIsTourOpen(false)
                setTutorial()
                localStorage.setItem("willingNewTutorial", false)
            }}
            badgeContent={(curr, tot) => `${curr} of ${tot}`} 
            rounded={5}
            />
            {props.children}
        </TourContext.Provider>
    )
  }

const steps = [
    {
        selector: '[tour-selec="navbar"]',
        content: 'You can change between lectures/calendar view in the nav bar',
    },
    {
        selector: '[tour-selec="today-lecture"]',
        content: 'Here will be the lectures for today',
    },
    {
        selector: '[tour-selec="course-card"]',
        content: 'Here you can foud lectures regrouped by courses',
    },
];



export const getTourState = (state) =>{
    return{
        show : 0, //This state variable is used to choose the content to show. (0 : table, 1: calendar)
        courses: tourCourses,
        lectures: tourLecture,
        togglecourse: null,
        modal: {show: 0, lecture: null, message: null}, //this object contains all modal state variables
        popup: {show: 0, lecture: {Name: "", Date: ""}, message: null}// this object contains all popup related variables
    }
}

const today = new Date();
const tomorrow = new Date(today)
tomorrow.setDate(tomorrow.getDate() + 1)

        // BookedSeats: 1
        // Capacity: 100
        // Course_Ref: "C2468"
        // Date: "2021-03-08 15:00:00"
        // DateDeadline: "2021-03-07 23:00:00"
        // EndDate: "2021-03-08 18:00:00"
        // Name: "WA Les:3"
        // Type: "p"
        // alreadyBooked: true


const tourLecture = [
    {
        Name: "Lecture1",
        Type: "p",
        Date: today,
        DateDeadline: tomorrow,
        Course_Ref: "C0123",
        Capacity: 50,
        BookedSeats: 5
    },
    {
        Name: "Lecture2",
        Type: "p",
        Date: tomorrow,
        Capacity: 50,
        BookedSeats: 50,
        Course_Ref: "C0123"
    },
]

const tourCourses = [
{
    CourseID: "C0123",
    Name: "Software Engineering II"
}
]