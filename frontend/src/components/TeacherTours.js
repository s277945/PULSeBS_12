import React, { useState, createContext } from 'react'
import { setTutorial } from '../api/api'
import Tour from 'reactour'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'

const today = new Date();
const tomorrow = new Date(today)
tomorrow.setDate(today.getDate() + 1)
const afterTomorrow = new Date(today)
afterTomorrow.setDate(today.getDate() + 2)
const yesterday = new Date(today)
yesterday.setDate(today.getDate() + -1)
const beforeYesterday = new Date(today)
beforeYesterday.setDate(today.getDate() + -2)

//Tour for Lectures tab
export const TeacherLecTourContext = createContext();

export function TeacherLecTour(props) {
    const [isTourOpen, setIsTourOpen] = useState(true);

    {
        if (localStorage.getItem("tutorial") == 1 &&
            localStorage.getItem("willingNewTutorial") == "false" &&
            isTourOpen === true)
            setIsTourOpen(false)
        else if (localStorage.getItem("tutorial") == 0 && localStorage.getItem("tutorialLec") == "true" && isTourOpen === true)
            if (localStorage.getItem("willingNewTutorial") == "false") setIsTourOpen(false)
            else if (localStorage.getItem("tutorial") == 1 &&
                localStorage.getItem("willingNewTutorial") == "false" &&
                isTourOpen === true)
                setIsTourOpen(false)
    }

    const steps = [
        {
            selector: '[tour-selec="TeachNavBar"]',
            content: 'Here you can switch tabs between Lectures/StudentList/HistoricalData',
        },
        {
            selector: '[tour-selec="LecTable"]',
            content: 'In this table you can find courses and their upcoming lessons.',
        },
        {
            selector: '[tour-selec="LecButton"]',
            content: 'Use this button to modify a lecture and turn it into a distance lecture or cancel it.',
        },
    ]

    const tableData = [{
        BookedSeats: 1,
        Capacity: 100,
        Course_Ref: "C0123",
        Date: tomorrow,
        DateDeadline: afterTomorrow,
        EndDate: "2021-03-08 18:00:00",
        Name: "Soft Eng II Les:3",
        Type: "p"
    },
    {
        BookedSeats: 1,
        Capacity: 100,
        Course_Ref: "C0123",
        Date: afterTomorrow,
        DateDeadline: afterTomorrow,
        EndDate: "2021-03-08 18:00:00",
        Name: "Soft Eng II Les:4",
        Type: "p"
    }]


    const getTourState = (state) => {
        return {
            tableData: tableData,
            modalShow: false,
            selectedLec: {},
            popup: {show: false, message: ""}
        }
    }

    const tour = {
        isTourOpen: isTourOpen,
        setIsTourOpen: setIsTourOpen,
        getTourState: getTourState
    }

    return (
        <TeacherLecTourContext.Provider value={tour}>
            <Tour
                steps={steps}
                isOpen={isTourOpen}
                disableInteraction={true}
                onRequestClose={() => {
                    setIsTourOpen(false)
                    setTutorial()
                    localStorage.setItem("willingNewTutorial", false)
                    localStorage.setItem("tutorialLec", true)
                }}
                onAfterOpen={target => disableBodyScroll(target)}
                onBeforeClose={target => enableBodyScroll(target)}
                badgeContent={(curr, tot) => `${curr} of ${tot}`}
                rounded={5}
                startAt={0}
            />
            {props.children}
        </TeacherLecTourContext.Provider>
    )
}

//Tour for Student List tab

export const TeacherSLTourContext = createContext();

export function TeacherSLTour(props) {
    const [isTourOpen, setIsTourOpen] = useState(false);

    {
        if (localStorage.getItem("tutorial") == 1 &&
            localStorage.getItem("willingNewTutorial") == "false" &&
            isTourOpen === true) setIsTourOpen(false)
        else if (localStorage.getItem("tutorial") == 0 && localStorage.getItem("tutorialSL") == "true" && isTourOpen === true)
            if (localStorage.getItem("willingNewTutorial") == "false") setIsTourOpen(false)
            else if (localStorage.getItem("tutorial") == 1 &&
                localStorage.getItem("willingNewTutorial") == "false" &&
                isTourOpen === true)
                setIsTourOpen(false)
    }

    const steps_2 = [
        {
            selector: '[tour-selec="TeachNavBar"]',
            content: 'Here you can switch tabs between Lectures/StudentList/HistoricalData',
        },
        {
            selector: '[tour-selec="programedLectures"]',
            content: 'In this section you can find courses and their upcoming lessons.',
        },
        {
            selector: '[tour-selec="showList"]',
            content: 'Use this button to see the students that are willing to attend the lesson.',
        },
        {
            selector: '[tour-selec="pastLectures"]',
            content: 'In this section you can find courses and their current/past lessons.',
        },
        {
            selector: '[tour-selec="setAttendance"]',
            content: 'If the lesson has been held in the past 24 hours, you can set student attendance using this button.',
        },
        {
            selector: '[tour-selec="showPast"]',
            content: 'Use this button to see the students that attended a past lesson.',
        },
    ]



    const tableData_2 = [{
        BookedSeats: 1,
        Capacity: 100,
        Course_Ref: "C0123",
        Date: tomorrow,
        DateDeadline: afterTomorrow,
        EndDate: "2021-03-08 18:00:00",
        Name: "Soft Eng II Les:3",
        Type: "p"
    },
    {
        BookedSeats: 1,
        Capacity: 100,
        Course_Ref: "C0123",
        Date: afterTomorrow,
        DateDeadline: afterTomorrow,
        EndDate: "2021-03-08 18:00:00",
        Name: "Soft Eng II Les:4",
        Type: "p"
    }]

    const pastTableData = [{
        BookedSeats: 1,
        Capacity: 100,
        Course_Ref: "C0123",
        Date: today,
        DateDeadline: "2021-03-07 23:00:00",
        EndDate: "2021-03-08 18:00:00",
        Name: "Soft Eng II Les:2",
        Type: "p"
    },
    {
        BookedSeats: 1,
        Capacity: 100,
        Course_Ref: "C0123",
        Date: beforeYesterday,
        DateDeadline: beforeYesterday,
        EndDate: "2021-03-08 18:00:00",
        Name: "Soft Eng II Les:1",
        Type: "p"
    }]

    const getTourState = (state) => {
        return { tableData: tableData_2, pastTableData: pastTableData, modalTableData: [], modalLecture: null, modal: 0, element: null }
    }

    const tour = {
        isTourOpen: isTourOpen,
        setIsTourOpen: setIsTourOpen,
        getTourState: getTourState
    }



    return (
        <TeacherSLTourContext.Provider value={tour}>
            <Tour
                steps={steps_2}
                isOpen={isTourOpen}
                disableInteraction={true}
                onRequestClose={() => {
                    setIsTourOpen(false)
                    setTutorial()
                    localStorage.setItem("willingNewTutorial", false)
                    localStorage.setItem("tutorialSL", true)
                }}
                onAfterOpen={target => disableBodyScroll(target)}
                onBeforeClose={target => enableBodyScroll(target)}
                badgeContent={(curr, tot) => `${curr} of ${tot}`}
                rounded={5}
                startAt={0}
            />
            {props.children}
        </TeacherSLTourContext.Provider>
    )
}

//Tour for Historical Data tab

export const TeacherHistTourContext = createContext();

export function TeacherHistTour(props) {
    const [isTourOpen, setIsTourOpen] = useState(false);

    {
        if (localStorage.getItem("tutorial") == 1 &&
            localStorage.getItem("willingNewTutorial") == "false" &&
            isTourOpen === true)
            setIsTourOpen(false)
        else if (localStorage.getItem("tutorial") == 0 && localStorage.getItem("tutorialHT") == "true" && isTourOpen === true)
            if (localStorage.getItem("willingNewTutorial") == "false") setIsTourOpen(false)
            else if (localStorage.getItem("tutorial") == 1 &&
                localStorage.getItem("willingNewTutorial") == "false" &&
                isTourOpen === true)
                setIsTourOpen(false)
    }

    const tour = {
        isTourOpen: isTourOpen,
        setIsTourOpen: setIsTourOpen,
    }

    const steps_3 = [
        {
            selector: '[tour-selec="center"]',
            content: 'Int this page you will find statistics about students attendace to lessons.',
        },
        {
            selector: '[tour-selec="TeachNavBar"]',
            content: 'Here you can switch tabs between Lectures/StudentList/HistoricalData',
        },
        {
            selector: '[tour-selec="graph"]',
            content: 'Here is a graph with the average attendance to lessons',
        },
        {
            selector: '[tour-selec="detailLevel"]',
            content: 'You can change the level of detail between Lectures/Weekly/Monthly.',
        },
        {
            selector: '[tour-selec="histTables"]',
            content: 'Here you find the statistics displayed in tables.',
        },
    ]

    return (
        <TeacherHistTourContext.Provider value={tour}>
            <Tour
                steps={steps_3}
                isOpen={isTourOpen}
                disableInteraction={true}
                onRequestClose={() => {
                    setIsTourOpen(false)
                    setTutorial()
                    localStorage.setItem("willingNewTutorial", false)
                    localStorage.setItem("tutorialHT", true)
                }}
                onAfterOpen={target => disableBodyScroll(target)}
                onBeforeClose={target => enableBodyScroll(target)}
                badgeContent={(curr, tot) => `${curr} of ${tot}`}
                rounded={5}
                startAt={0}
            />
            {props.children}
        </TeacherHistTourContext.Provider>
    )
}