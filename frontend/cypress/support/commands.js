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
Cypress.Commands.add("login",(username,password,type)=>{
    cy.server()
    cy.route({
        method:'POST',
        url:'/api/login',
        status:200,
        request:{userName:username,password:password},
        response:{user:username,userType:type}
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
//RENDER BASIC PAGE STUDENT
