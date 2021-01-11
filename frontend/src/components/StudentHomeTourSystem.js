import React, { useState, useContext, createContext } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Tour from 'reactour'

export const TourContext = createContext();

export default function StudentHomeTour(props){
    const [isTourOpen, setIsTourOpen] = useState(true);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

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
            disableInteraction={true}
            onBeforeClose={() => handleShow()}
            />
            <TourModal show={show} handleClose={handleClose} handleShow={handleShow}/>
            {props.children}
        </TourContext.Provider>
    )
  };

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
        observe: '[tour-selec="course-card"]'
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