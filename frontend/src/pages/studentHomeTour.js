import React, { useState, useContext, createContext } from 'react'
import Tour from 'reactour'

export const TourContext = createContext();

export default function StudentHomeTour(props){
    const [isTourOpen, setIsTourOpen] = useState(true);
  
    return (
        <TourContext.Provider value={isTourOpen, setIsTourOpen}>
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
  