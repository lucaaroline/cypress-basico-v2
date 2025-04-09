
Cypress.Commands.add('fillMandatoryFieldsAndSubmit', (data = {
    firstname:'Jhonny',                         //dados default, caso o argumento 'data' não seja chamado:'cy.fillMandatoryFieldsAndSubmit()' 
    lastname: 'Santos',
    email:'jhonnybravo@teste.com',
    text: 'Test.'
}) => {
    cy.get('#firstName').type(data.firstname)
    cy.get('#lastName').type(data.lastname)
    cy.get('#email').type(data.email)
    cy.get('#open-text-area').type(data.text) 
    cy.contains('button', 'Enviar').click()   //usando o contains pra passar elemento e texto
})


