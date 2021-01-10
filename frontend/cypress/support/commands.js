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
//GENERIC COMMAND FOR LOGIN
import 'cypress-file-upload';

Cypress.Commands.add("login",(username,password,type,tutorial)=>{
    cy.server()
    cy.route({
        method:'POST',
        url:'/api/login',
        status:200,
        request:{userName:username,password:password},
        response:{user:username,userType:type,tutorial:tutorial}
    }).as('login')
    cy.fixture('students.json').then((data)=>{
        let length=data.length;
        for(let i=0;i<length;i++){
            cy.route(data[i].method,data[i].url,data[i].data);
        }
    })
    cy.get('input:first').type('s266260').should('have.value','s266260')
    cy.get('input:last').type('scimmia').should('have.value','scimmia')
    cy.get('.btn.btn-primary')
        .click()

    cy.wait('@login')
})
Cypress.Commands.add("teacher",(username,password,type)=>{
    cy.server()
    cy.route({
        method:'POST',
        url:'/api/login',
        status:200,
        request:{userName:username,password:password},
        response:{user:username,userType:type}
    }).as('login')
    cy.fixture('teacher.json').then((data)=>{
        let length=data.length;
        for(let i=0;i<length;i++){
            cy.route(data[i].method,data[i].url,data[i].data);
        }
    })
    cy.get('input:first').type('t987654').should('have.value','t987654')
    cy.get('input:last').type('scimmia').should('have.value','scimmia')
    cy.get('.btn.btn-primary')
        .click()

    cy.wait('@login')
})
Cypress.Commands.add("supportOfficer",(username,password,type)=>{
    cy.server()
    cy.route({
        method:'POST',
        url:'/api/login',
        status:200,
        request:{userName:username,password:password},
        response:{user:username,userType:type}
    }).as('login')
    cy.fixture('supportOfficer.json').then((data)=>{
        let length=data.length;
        for(let i=0;i<length;i++){
            cy.route(data[i].method,data[i].url,data[i].data);
        }
    })
    cy.get('input:first').type('so123456').should('have.value','so123456')
    cy.get('input:last').type('scimmia').should('have.value','scimmia')
    cy.get('.btn.btn-primary')
        .click()

    cy.wait('@login')
})
Cypress.Commands.add("bookingManager",(username,password,type)=>{
    cy.server()
    cy.route({
        method:'POST',
        url:'/api/login',
        status:200,
        request:{userName:username,password:password},
        response:{user:username,userType:type}
    }).as('login')
    cy.fixture('bookingManager.json').then((data)=>{
        let length=data.length;
        for(let i=0;i<length;i++){
            cy.route(data[i].method,data[i].url,data[i].data);
        }
    })
    cy.get('input:first').type('b123456').should('have.value','b123456')
    cy.get('input:last').type('scimmia').should('have.value','scimmia')
    cy.get('.btn.btn-primary')
        .click()

    cy.wait('@login')
})

Cypress.Commands.add(
    'dropFile', {
        prevSubject: false
    }, (fileName) => {
        Cypress.log({
            name: 'dropFile',
        })
        return cy
            .fixture(fileName, 'base64')
            .then(Cypress.Blob.base64StringToBlob)
            .then(blob => {
                // instantiate File from `application` window, not cypress window
                return cy.window().then(win => {
                    const file = new win.File([blob], fileName)
                    const dataTransfer = new win.DataTransfer()
                    dataTransfer.items.add(file)

                    return cy.document().trigger('drop', {
                        dataTransfer,
                    })
                })
            })
    }
)
//RENDER BASIC PAGE STUDENT
