import React, { useState, useContext, createContext } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { setTutorial } from '../api/api'
import Tour from 'reactour'
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'

export const TourContext = createContext();

export default function StudentHomeTour(props){
    
    const [isTourOpen, setIsTourOpen] = useState(false);
    const [stepsNum, setStepsNum] = useState(0);
    const [first, setFirst] = useState(false);
    let steps=lectureSteps1;
    const disableBody = target => disableBodyScroll(target)
    const enableBody = target => enableBodyScroll(target)

    if(localStorage.getItem("tutorial") == 0 && localStorage.getItem("willingNewTutorialSL")=="false" && isTourOpen===false) { setIsTourOpen(true); setFirst(true);} 
    if(localStorage.getItem("tutorial") == 0 && stepsNum===1 && localStorage.getItem("willingNewTutorialSC")=="false" && isTourOpen===false) { setIsTourOpen(true); setFirst(true);} 
    //if(localStorage.getItem("tutorial") == 1 && localStorage.getItem("willingNewTutorial") == "false" && isTourOpen===true) { setIsTourOpen(false); setFirst(false);} 
    
    const tour = {
        isTourOpen: isTourOpen,
        setIsTourOpen: setIsTourOpen,
        setStepsNum: setStepsNum,
    }
    if(!first) steps=lectureSteps2
    if(stepsNum===1) steps = calendarSteps;

    return (
        <TourContext.Provider value={tour}>
            <Tour
            steps={steps}
            isOpen={isTourOpen}
            disableInteraction={true}
            onRequestClose={() => {
                setIsTourOpen(false)
                setTutorial()
                steps=lectureSteps1
                if(first&&localStorage.getItem("willingNewTutorialSL")!="false") localStorage.setItem("willingNewTutorialSC", true)
                if(first) localStorage.setItem("willingNewTutorialSL", true)
                setFirst(false);
            }}
            onAfterOpen={disableBody}
            onBeforeClose={enableBody}
            badgeContent={(curr, tot) => `${curr} of ${tot}`} 
            rounded={5}
            disableInteraction={true}
            startAt={0}
            />
            {/* <TourModal show={show} handleClose={handleClose} handleShow={handleShow}/> */}
            {props.children}
        </TourContext.Provider>
    )
  }

const lectureSteps1 = [
    {
        selector: '',
        content: "Welcome! This is the student page tutorial. Click on the arrow to follow to the next step or the cross on the top right to close it",
    },
    {
        selector: '[tour-selec="navbar"]',
        content: 'You can change between lectures/calendar view in the nav bar',
    },
    {
        selector: '[tour-selec="today-lecture"]',
        content: 'Here will be the lectures for today',
    },
    {
        selector: '[tour-selec="BookButton"]',
        content: 'Use this button to book a seat for this course',
    },
    {
        selector: '[tour-selec="CancelButton"]',
        content: 'Once booked you can use this button to cancel the booking',
    },
    {
        selector: '[tour-selec="WarnButton"]',
        content: 'Use this button to enter the waiting list for a lecture once there are no more available seats',
    },
    {
        selector: '[tour-selec="course-card"]',
        content: 'Here you can find lectures grouped by course',
    },

];

const lectureSteps2 = [
    {
        selector: '[tour-selec="navbar"]',
        content: 'You can change between lectures/calendar view in the nav bar',
    },
    {
        selector: '[tour-selec="today-lecture"]',
        content: 'Here will be the lectures for today',
    },
    {
        selector: '[tour-selec="BookButton"]',
        content: 'Use this button to book a seat for this course',
    },
    {
        selector: '[tour-selec="CancelButton"]',
        content: 'And this button to can cancel the booking',
    },
    {
        selector: '[tour-selec="WarnButton"]',
        content: 'Use this button to enter the waiting list for a lecture once there are no more available seats',
    },
    {
        selector: '[tour-selec="course-card"]',
        content: 'Here you can find lectures grouped by course',
    },

];


const calendarSteps = [
    {
        selector: '[tour-selec="navbar"]',
        content: 'You can change between lectures/calendar view in the nav bar',
    },
    {
        selector: '.fc',
        content: 'This Calendar will show you all your courses',
    },
    {
        selector: '.fc-timeGridWeek-button',
        content: 'This button will set the view by week (as it currently is)',
    },
    {
        selector: '.fc-dayGridMonth-button',
        content: 'This button will set the view by month',
    },
    {
        selector: '.fc-button-group',
        content: 'You can browse to the previous/next time window with these buttons',
    },
    {
        selector: '.fc-today-button',
        content: 'Press this button to return to the current time window',
    },
    {
        selector: '.fc-event-main',
        content: 'Lectures appear inside the calendar as boxes with different colors and lengths depending on the course and lecture duration',
    },
    
];


const TourModal = ({show, handleClose, handleShow}) => {
    return (
        <>
          <Modal react-tour="tour-modal" show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Are you sure you want to leave the tour?</Modal.Title>
            </Modal.Header>
            <Modal.Body>Youn can leave the tour if you feeling at ease</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Quit tour
              </Button>
              <Button variant="primary" onClick={handleClose}>
                Return to tour
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      );
}

export const getTourState = (show) =>{
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
today.setMinutes(30);
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1)

const today2HoursLater = new Date(today);
const today4HoursLater = new Date(today);
today.setHours(13);
today2HoursLater.setHours(15);
today4HoursLater.setHours(17);

const tourLecture = [
    {
        Name: "SE2: Lecture 1",
        Type: "p",
        Date: today,
        EndDate: today2HoursLater,
        DateDeadline: tomorrow,
        Course_Ref: "C0123",
        Capacity: 50,
        BookedSeats: 5
    },
    {
        Name: "MFI: Lecture 1",
        Type: "p",
        Date: today2HoursLater,
        EndDate: today4HoursLater,
        DateDeadline: tomorrow,
        Capacity: 50,
        BookedSeats: 50,
        Course_Ref: "XY1211"
    },
]

const tourCourses = [
    {
        CourseID: "C0123",
        Name: "Software Engineering II"
    },
    {
        CourseID: "XY1211",
        Name: "Metodi di finanziamento delle imprese"
    }
]