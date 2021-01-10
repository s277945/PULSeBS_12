import React, { useState, useContext, createContext } from 'react'
import { setTutorial } from '../api/api'
import { ProvideAuth } from './Authsystem'
import Tour from 'reactour'

export const TeacherLecTourContext = createContext();

export function TeacherLecTour(props) {
    const [isTourOpen, setIsTourOpen] = useState(true);

    {
        if(localStorage.getItem("tutorial") == 1 && 
            localStorage.getItem("willingNewTutorial") == "false" && 
            isTourOpen===true) 
                setIsTourOpen(false)
        else if(localStorage.getItem("tutorial") == 0 && localStorage.getItem("tutorialLec") == "true"  && isTourOpen===true)
            if(localStorage.getItem("willingNewTutorial") == "false") setIsTourOpen(false)
        else if (localStorage.getItem("tutorial") == 1 && 
            localStorage.getItem("willingNewTutorial") == "false" && 
            isTourOpen===true) 
                setIsTourOpen(false)  
    }

    const tour = {
        isTourOpen: isTourOpen,
        setIsTourOpen: setIsTourOpen,
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

    return (
        <TeacherLecTourContext.Provider value={tour}>
            <Tour
                steps={steps}
                isOpen={isTourOpen}
                onRequestClose={() => {
                    setIsTourOpen(false)
                    setTutorial()
                    localStorage.setItem("willingNewTutorial", false)
                    localStorage.setItem("tutorialLec", true)
                }}
                badgeContent={(curr, tot) => `${curr} of ${tot}`}
                rounded={5}
            />
            {props.children}
        </TeacherLecTourContext.Provider>
    )
}

export const TeacherSLTourContext = createContext();

export function TeacherSLTour(props) {
    const [isTourOpen, setIsTourOpen] = useState(false);

    {
        if(localStorage.getItem("tutorial") == 1 && 
            localStorage.getItem("willingNewTutorial") == "false" && 
            isTourOpen===true) setIsTourOpen(false) 
        else if(localStorage.getItem("tutorial") == 0 && localStorage.getItem("tutorialSL") == "true"  && isTourOpen===true)
            if(localStorage.getItem("willingNewTutorial") == "false")  setIsTourOpen(false)
        else if (localStorage.getItem("tutorial") == 1 && 
            localStorage.getItem("willingNewTutorial") == "false" && 
            isTourOpen===true) 
                setIsTourOpen(false)   
    }

    const tour = {
        isTourOpen: isTourOpen,
        setIsTourOpen: setIsTourOpen,
    }

    const steps = [
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

    return (
        <TeacherSLTourContext.Provider value={tour}>
            <Tour
                steps={steps}
                isOpen={isTourOpen}
                onRequestClose={() => {
                    setIsTourOpen(false)
                    setTutorial()
                    localStorage.setItem("willingNewTutorial", false)
                    localStorage.setItem("tutorialSL", true)
                }}
                badgeContent={(curr, tot) => `${curr} of ${tot}`}
                rounded={5}
            />
            {props.children}
        </TeacherSLTourContext.Provider>
    )
}

export const TeacherHistTourContext = createContext();

export function TeacherHistTour(props) {
    const [isTourOpen, setIsTourOpen] = useState(false);

    {
        if(localStorage.getItem("tutorial") == 1 && 
            localStorage.getItem("willingNewTutorial") == "false" && 
            isTourOpen===true) 
                setIsTourOpen(false) 
        else if(localStorage.getItem("tutorial") == 0 && localStorage.getItem("tutorialHT") == "true"  && isTourOpen===true)
            if(localStorage.getItem("willingNewTutorial") == "false") setIsTourOpen(false)  
        else if (localStorage.getItem("tutorial") == 1 && 
            localStorage.getItem("willingNewTutorial") == "false" && 
            isTourOpen===true) 
                setIsTourOpen(false)   
    }

    const tour = {
        isTourOpen: isTourOpen,
        setIsTourOpen: setIsTourOpen,
    }

    const steps = [
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
                steps={steps}
                isOpen={isTourOpen}
                onRequestClose={() => {
                    setIsTourOpen(false)
                    setTutorial()
                    localStorage.setItem("willingNewTutorial", false)
                    localStorage.setItem("tutorialHT", true)
                }}
                badgeContent={(curr, tot) => `${curr} of ${tot}`}
                rounded={5}
            />
            {props.children}
        </TeacherHistTourContext.Provider>
    )
}