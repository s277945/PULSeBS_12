import React, { useState, useContext, createContext } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { setTutorial } from '../api/api'
import Tour from 'reactour'
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'

export const TourContext = createContext();

export default function StudentHomeTour(props){
    
    const [isTourOpen, setIsTourOpen] = useState(true);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const disableBody = target => disableBodyScroll(target)
    const enableBody = target => enableBodyScroll(target)
    if(localStorage.getItem("tutorial") == 1 && localStorage.getItem("willingNewTutorial") == "false" && isTourOpen===true) setIsTourOpen(false)   
        
    const tour = {
        isTourOpen: isTourOpen,
        setIsTourOpen: setIsTourOpen
    }

    return (
        <TourContext.Provider value={tour}>
            <Tour
            steps={steps}
            isOpen={isTourOpen}
            disableInteraction={true}
            onRequestClose={() => {
                setIsTourOpen(false)
                setTutorial()
                localStorage.setItem("willingNewTutorial", false)
            }}
            onAfterOpen={disableBody}
            onBeforeClose={enableBody}
            badgeContent={(curr, tot) => `${curr} of ${tot}`} 
            rounded={5}
            disableInteraction={true}
            onBeforeClose={() => handleShow()}
            startAt={0}
            />
            {/* <TourModal show={show} handleClose={handleClose} handleShow={handleShow}/> */}
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
        selector: '[tour-selec="BookButton"]',
        content: 'Use this button to book a seat for this course',
    },
    {
        selector: '[tour-selec="CancelButton"]',
        content: 'And this button to can cancel the booking',
    },
    {
        selector: '[tour-selec="course-card"]',
        content: 'Here you can find lectures grouped by course',
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