const userdata = require('../fixtures/userdata.json')

describe('Automation Exercise', () => {
    before(() => {
        cy.requestDeleteUser(userdata)
    })
    
    beforeEach(() => {
        cy.visit('https://automationexercise.com/')
        cy.get('body').should('be.visible')
    })

    it('1 - Register User', () => {
        cy.contains('Signup / Login').click()
        cy.contains('New User Signup!').should('be.visible')

        cy.signup(userdata)
        cy.contains('Enter Account Information').should('be.visible')

        cy.createAccount(userdata)
        cy.contains('Account Created!').should('be.visible')

        cy.clickContinue()
        cy.contains('Logged in as ' + userdata.name).should('be.visible')

        cy.contains('Delete Account').click()
        cy.contains('Account Deleted!').should('be.visible')

        cy.clickContinue()
    })

    context('Cenários com usuário já cadastrado', () => {
        beforeEach(() => {
            cy.requestCreateUser(userdata)
        })

        afterEach(() => {
            cy.requestDeleteUser(userdata)
        })

        it('2 - Login User with correct email and password', () => {
            cy.contains('Signup / Login').click()
            cy.contains('Login to your account').should('be.visible')

            cy.login(userdata)
            cy.contains('Logged in as ' + userdata.name).should('be.visible')

            cy.contains('Delete Account').click()
            cy.contains('Account Deleted!').should('be.visible')
        })

        it('3 - Login User with incorrect email and password', () => {
            cy.contains('Signup / Login').click()
            cy.contains('Login to your account').should('be.visible')

            const wrongUserdata = {
                email: "euerro@teste.abc",
                password: "euerro123"
            }

            cy.login(wrongUserdata)
            cy.contains('Your email or password is incorrect!').should('be.visible')
        })

        it('4 - Logout User', () => {
            cy.contains('Signup / Login').click()
            cy.contains('Login to your account').should('be.visible')

            cy.login(userdata)
            cy.contains('Logged in as ' + userdata.name).should('be.visible')

            cy.contains('Logout').click()
            cy.contains('Login to your account').should('be.visible')
        })

        it('5 - Register User with existing email', () => {
            cy.contains('Signup / Login').click()
            cy.contains('New User Signup!').should('be.visible')

            cy.signup(userdata)
            cy.contains('Email Address already exist!').should('be.visible')
        })

    })

    it('6 - Contact Us Form', () => {
        cy.contains('Contact us').click()
        cy.contains('Get In Touch').should('be.visible')

        cy.get('[data-qa="name"]').type(userdata.name)
        cy.get('[data-qa="email"]').type(userdata.email)
        cy.get('[data-qa="subject"]').type("Teste assunto")
        cy.get('[data-qa="message"]').type("Teste mensagem")
        cy.get('input[name="upload_file"]').selectFile('./cypress/fixtures/testpayload.txt')
        cy.get('[data-qa="submit-button"]').click()
        
        cy.contains('Success! Your details have been submitted successfully.').should('be.visible')

        cy.contains('Home').click()
        cy.url().should("eq", "https://automationexercise.com/")
    })

    it('8 - Verify All Products and product detail page', () => {
        cy.contains('Products').click()
        cy.url().should("eq", "https://automationexercise.com/products")
        cy.contains('All Products').should('be.visible')
        
        cy.get('.features_items').should('be.visible')
        cy.contains('View Product').first().click()
        cy.url().should("eq", "https://automationexercise.com/product_details/1")
    
        cy.get('.product-information').within(() => {
            cy.get('h2').should('be.visible') // product name
            cy.get('p').eq(0).should('be.visible') // category
            cy.get('span').should('be.visible') // price
            cy.get('p').eq(1).should('be.visible') // availability
            cy.get('p').eq(2).should('be.visible') // condition
            cy.get('p').eq(3).should('be.visible') // brand
        })
    })

    it('9 - Search Product', () => {
        cy.contains('Products').click()
        cy.url().should("eq", "https://automationexercise.com/products")
        cy.contains('All Products').should('be.visible')

        cy.get('#search_product').type('Blue Top')
        cy.get('#submit_search').click()
        cy.contains('Searched Products').should('be.visible')

        cy.get('.single-products').its('length').should('eq', 1)

        cy.get('.single-products').find('p').should('contain', 'Blue Top')
    })

    it('10 - Verify Subscription in home page', () => {
        cy.get('footer').scrollIntoView()
        cy.contains('Subscription').should('be.visible')

        cy.get('#susbscribe_email').type(userdata.email)
        cy.get('#subscribe').click()
        cy.contains('You have been successfully subscribed!').should('be.visible')
    })

    it('15 - Place Order: Register before Checkout', () => {
        cy.contains('Signup / Login').click()
        cy.signup(userdata)
        cy.createAccount(userdata)
        cy.contains('Account Created!').should('be.visible')

        cy.clickContinue()

        cy.contains('Logged in as ' + userdata.name).should('be.visible')

        cy.contains('Add to cart').first().click()
        cy.contains('View Cart').click()
        cy.url().should("eq", "https://automationexercise.com/view_cart")

        cy.contains('Proceed To Checkout').click()

        cy.verifyAddressDetails(userdata)

        cy.get('.cart_product').its('length').should('eq', 1)

        cy.get('textarea[name="message"]').type('Teste comentario')
        cy.contains('Place Order').click()

        cy.payment(userdata)
        cy.contains('Congratulations! Your order has been confirmed!').should('be.visible')

        cy.contains('Delete Account').click()
        cy.contains('Account Deleted!').should('be.visible')
        cy.clickContinue()
    })

})