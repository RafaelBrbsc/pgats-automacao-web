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
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('signup', (userdata) => {
    cy.get('[data-qa="signup-name"]').type(userdata.name)
    cy.get('[data-qa="signup-email"]').type(userdata.email)
    cy.get('[data-qa="signup-button"]').click()
})

Cypress.Commands.add('createAccount', (userdata) => {
    cy.get("#id_gender1").click()
    cy.get('[data-qa="password"]').type(userdata.password)
    cy.get('[data-qa="days"]').select(userdata.birth_date)
    cy.get('[data-qa="months"]').select(userdata.birth_month)
    cy.get('[data-qa="years"]').select(userdata.birth_year)
    cy.get("#newsletter").click()
    cy.get("#optin").click()
    cy.get('[data-qa="first_name"]').type(userdata.firstname)
    cy.get('[data-qa="last_name"]').type(userdata.lastname)
    cy.get('[data-qa="company"]').type(userdata.company)
    cy.get('[data-qa="address"]').type(userdata.address1)
    cy.get('[data-qa="address2"]').type(userdata.address2)
    cy.get('[data-qa="country"]').select(userdata.country)
    cy.get('[data-qa="state"]').type(userdata.state)
    cy.get('[data-qa="city"]').type(userdata.city)
    cy.get('[data-qa="zipcode"]').type(userdata.zipcode)
    cy.get('[data-qa="mobile_number"]').type(userdata.mobile_number)
    cy.get('[data-qa="create-account"]').click()
})

Cypress.Commands.add('clickContinue', () => {
    cy.get('[data-qa="continue-button"]').click()
})

Cypress.Commands.add('createUserAndLogin', (userdata) => {
    cy.contains('Signup / Login').click()
    cy.signup(userdata)
    cy.createAccount(userdata)
    cy.clickContinue()
})

Cypress.Commands.add('createUser', (userdata) => {
    cy.createUserAndLogin(userdata)
    cy.contains('Logout').click()
})

Cypress.Commands.add('login', (userdata) => {
    cy.get('[data-qa="login-email"]').type(userdata.email)
    cy.get('[data-qa="login-password"]').type(userdata.password)
    cy.get('[data-qa="login-button"]').click()
})

Cypress.Commands.add('verifyAddressDetails', (userdata) => {
    cy.get('#address_delivery').should('contain', userdata.firstname)
    cy.get('#address_delivery').should('contain', userdata.lastname)
    cy.get('#address_delivery').should('contain', userdata.address1)
    cy.get('#address_delivery').should('contain', userdata.address2)
    cy.get('#address_delivery').should('contain', userdata.city)
    cy.get('#address_delivery').should('contain', userdata.state)
    cy.get('#address_delivery').should('contain', userdata.country)
    cy.get('#address_delivery').should('contain', userdata.zipcode)
    cy.get('#address_delivery').should('contain', userdata.mobile_number)
})

Cypress.Commands.add('payment', (userdata) => {
    cy.get('[data-qa="name-on-card"]').type(userdata.name)
    cy.get('[data-qa="card-number"]').type('1111111111111111')
    cy.get('[data-qa="cvc"]').type('111')
    cy.get('[data-qa="expiry-month"]').type('11')
    cy.get('[data-qa="expiry-year"]').type('2050')
    cy.get('[data-qa="pay-button"]').click()
})

Cypress.Commands.add('requestCreateUser', (userdata) => {
    cy.request({
        method: 'POST',
        url: 'https://automationexercise.com/api/createAccount',
        form: true,
        body: userdata
    })
})

Cypress.Commands.add('requestDeleteUser', (userdata) => {
    cy.request({
        method: 'DELETE',
        url: 'https://automationexercise.com/api/deleteAccount',
        form: true,
        body: userdata
    })
})
