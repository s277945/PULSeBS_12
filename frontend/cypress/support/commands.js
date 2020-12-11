// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

const dao=require('../../../server/test/supportFunction')
const daoStud=require('../../../server/src/Dao/studentDao')
const courseId='';
const date='';
const deadline='';
const capacity=100;
Cypress.Commands.add("database",(operation)=>{
    if(operation.equals('teacher')){
        //restore type of lecture
        //restore deleted lecture
        dao.restoreTypeLecture(courseId, date).then(r =>{

        });
        dao.insertDeletedRow(courseId,'',date,deadline,capacity)
            .then(res=>{

            });

    }
    else if(operation.equals('student')){
        //modify size of a lecture to test waiting list
        daoStud.addSeat('',courseId,date,'')
            .then(res=>{

            });
        dao.updateCourseCapacity(courseId,date,1)
            .then();
        dao.deleteFromWaiting('',date,courseId)
            .then()
    }
})