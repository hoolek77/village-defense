describe('Game', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('Home Page', () => {
    it('shows settings dialog when Settings button is clicked', () => {
      cy.get('#settings-button').click()

      cy.contains('Select Game Difficulty')
    })

    it('shows splash screen before game will be started', () => {
      cy.get('#start-game-button').click()

      cy.contains('Loading game')
    })
  })

  describe('Settings Modal', () => {
    it('allows to change game difficulty', () => {
      cy.get('#settings-button').click()

      cy.get('#difficulty-medium').should('be.checked')

      cy.get('#difficulty-easy').check().should('be.checked')
    })
  })

  describe('Game Page', () => {
    beforeEach(() => {
      cy.get('#start-game-button').click()
    })

    it('is visible after splash screen', () => {
      cy.contains(
        'Welcome! Start managing your village and protect it from nasty goblins'
      )
    })

    it('allows to upgrading building', () => {
      cy.get('.building__upgrade-button--Wall').click()

      cy.contains('You have started to upgrading the Wall.')
    })
  })
})
