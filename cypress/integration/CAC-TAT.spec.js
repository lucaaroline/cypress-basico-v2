/// <reference types="Cypress" />

  describe('Central de Atendimento ao Cliente TAT', function() {       //O bloco 'describe' define a suíte de testes 
    beforeEach(function() {         //pré condição, roda sempre antes de cada teste
        cy.visit('./src/index.html') 
    })

    it('verifica o título da aplicação', function() {               //bloco 'it' define um caso de teste.
       cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })


    it('preenche os campos obrigatórios e envia o formulário', function() {
      cy.clock() // congela o relógio do navegador

      const longtext = 'test test test test test test test test test test test test'
      /*const usado para declarar variável em Javascript */

      cy.get('#firstName').type('Luiza')
      cy.get('#lastName').type('Ribeiro')
      cy.get('#email').type('luizacarolinetwo@hotmail.com')
      cy.get('#open-text-area').type(longtext, { delay: 0})  /* texto grande, sobrescrever o valor da propriedade 'delay' p/ 0 milisegundos */
      cy.contains('button', 'Enviar').click()   //usando o contains pra passar elemento e texto

      cy.get('.success').should('be.visible')   //classe que representa a mensagem de sucesso da tela

      cy.tick(3000) // avança o relógio 3 segundos (em milissegundos). Avançar o tempo para não perdê-lo esperando.
      cy.get('.success').should('not.be.visible')
    })


    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function(){
      cy.clock()

      cy.get('#firstName').type('Luiza')
      cy.get('#lastName').type('Ribeiro')
      cy.get('#email').type('luizacarolinetwohotmail.com')
      cy.get('#open-text-area').type('texto')
      cy.contains('button', 'Enviar').click()

      cy.get('.error').should('be.visible')   //classe que representa a mensagem de erro da tela

      cy.tick(3000)
      cy.get('.error').should('not.be.visible')
    })

    it('campo telefone continua vazio quando preenchido com valor não numérico', function(){
      cy.get('#phone')
        .type('numero')
        .should('have.value', '')
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function(){
      cy.clock()

      cy.get('#firstName').type('Luiza')
      cy.get('#lastName').type('Ribeiro')
      cy.get('#email').type('luizacaroline@twohotmail.com')
      cy.get('#phone-checkbox').check()
      cy.get('#open-text-area').type('texto')
      cy.contains('button', 'Enviar').click()

      cy.get('.error').should('be.visible')

      cy.tick(3000)
      cy.get('.error').should('not.be.visible')
    })

    it('preenche e limpa o campo nome', function(){
      cy.get('#firstName')
        .type('Luiza')
        .should('have.value', 'Luiza')
        .clear()
        .should('have.value', '')
    })

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function(){
      cy.clock()

      cy.contains('button', 'Enviar').click()
      cy.get('.error').should('be.visible')

      cy.tick(3000)
      cy.get('.error').should('not.be.visible')
    })

    
    it('envia o formuário com sucesso usando um comando customizado', function(){
      cy.clock()

     const data = {                          //passando os dados por meio de um objeto chamado 'data'
        firstname: 'Luiza',
        lastname: 'Ribeiro',
        email: 'luizacaroline@hotmail.com',
        text: 'Teste.'
      }

      cy.fillMandatoryFieldsAndSubmit(data)       //comando criado no arquivo cypress/support/commands.js
      cy.get('.success').should('be.visible')

      cy.tick(3000)
      cy.get('.success').should('not.be.visible')
    })


    it('seleciona um produto (YouTube) por seu texto', () => {
      cy.get('#product')
        .select('YouTube')
        .should('have.value', 'youtube')
    })

    it('seleciona um produto (Mentoria) por seu valor (value)', () => {
      cy.get('#product')
        .select('mentoria')
        .should('have.value', 'mentoria')
    })

    it('seleciona um produto (Blog) por seu índice', () => {
      cy.get('#product')
        .select(1)
        .should('have.value', 'blog')
    })

    it('marca o tipo de atendimento "Feedback', () => {
      cy.get('input[type="radio"][value="feedback"]') //campo mapeado pelo type e value desse input
        .check()
        .should('be.checked')
    })

    it('marca cada tipo de atendimento', () => {
      cy.get('input[type="radio"]')              //com o mapeamento geral, vai encontrar e marcar todos os elementos compatíveis
        .each(typeOfService => {                 //each recebe como argumento uma função "()=>{}", e essa função recebe como argumento cada um dos radio ("typeOfService")
          cy.wrap(typeOfService)                 //wrap vai 'empacotar' cada um dos tipos de atendimento
            .check()
            .should('be.checked')                                  
        })
    })

    it('marca ambos checkboxes, depois desmarca o último', () => {
      cy.get('input[type="checkbox"]')            //com o mapeamento geral, vai encontrar e marcar todos os elementos compatíveis
        .check()
        .should('be.checked')

        .last().uncheck()                         //vai acessar o último elemento e desmarcar
        .should('not.be.checked')                 //asserções negativas usam o .should('not.be...')
    })

    it('seleciona um arquivo da pasta fixtures', () => {
      cy.get('#file-upload')            //pegando input do tipo 'file' | type=file 
        .selectFile('cypress/fixtures/example.json')        //cypress sempre passa adiante pro próximo comando o campo/comando encontrado no comando anterior
        .should(input => {               //should tambem pode receber uma função callback
          expect(input[0].files[0].name).to.equal('example.json')

          //comando "console.log(input)" permite visualizar no navegador (inspecionar/console) a info de log desse elemento para ser mapeado
          //comando "console.log(input[0].files[0].name)" imprime na tela exatamente o elemento no log
        } )
    })

    it('seleciona um arquivo simulando um drag-and-drop', () => {
      cy.get('#file-upload')            
        .selectFile('cypress/fixtures/example.json', { action: 'drag-drop'})   //2 argumentos: caminho do arquivo, e objeto 'action' com propriedade drag-drop
        .should(input => {        
          expect(input[0].files[0].name).to.equal('example.json')
        })
    })

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
      cy.fixture('example.json').as('exampleFile')          //quando chamo a funcionalidade fixture, passo só o nome do arquivo e o cypress busca direto na pasta
      cy.get('#file-upload')            
        .selectFile('@exampleFile')     //chamando o nome alias dado acima
        .should(input => {        
          expect(input[0].files[0].name).to.equal('example.json')
        })
    })

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
      cy.contains('a', 'Política de Privacidade')          //mapeando link pela tag e texto
        .should('have.attr', 'href', 'privacy.html')       //validação de que abre o endereço correto
        .and('have.attr', 'target', '_blank')              //validação de que o link possui atributos para abrir em nova aba
    })


    it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
      cy.contains('a', 'Política de Privacidade')
        .invoke('removeAttr', 'target')                   //invoke - invoca uma função no sujeito que veio anteriormente
        .click()
      
      cy.contains('h1', 'CAC TAT - Política de privacidade').should('be.visible')
    })


    it('exibe e esconde as mensagens de sucesso e erro usando o .invoke', () => {
      cy.get('.success')
        .should('not.be.visible')
        .invoke('show') //remove a propriedade 'none' do atributo display
        .should('be.visible')
        .and('contain', 'Mensagem enviada com sucesso.')
        .invoke('hide')
        .should('not.be.visible')

      cy.get('.error')
        .should('not.be.visible')
        .invoke('show')
        .should('be.visible')
        .and('contain', 'Valide os campos obrigatórios!')
        .invoke('hide')
        .should('not.be.visible')
    })

    it('preenche a area de texto usando o comando invoke', () => {
      cy.get('#open-text-area')
        .invoke('val', 'Um texto qualquer')
        .should('have.value', 'Um texto qualquer')
    })

    it('faz uma requisição HTTP', () => {
      cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
        .as('getRequest')           //dá um alias a requisição para ser referenciada em futura consulta
        .its('status')
        .should('be.equal', 200)
      
      cy.get('@getRequest')
        .its('statusText')
        .should('be.equal', 'OK')

      cy.get('@getRequest')
        .its('body')
        .should('include', 'CAC TAT')
    })

    it('encontrar o gato escondido', () => {
      cy.get('#cat')
        .should('not.be.visible')
        .invoke('show') 
        .should('be.visible')
      cy.get('#title')
        .invoke('text', 'CAT TAT')    //ao encontrar o elemento, se usa o invoke para alterar informações do form
      cy.get('#subtitle')
        .invoke('text', 'Eu ❤︎ gatinhos')

    })







  })