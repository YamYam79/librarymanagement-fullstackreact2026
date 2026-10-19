// describe() regroupe des scénarios autour d'une même fonctionnalité
// et it() décrit un comportement à vérifier.
describe('Book list', () => {

    it('should display books returned by the API', () => {

        // cy.intercept() intercepte ici la requête GET /books.
        // Dans ce premier exemple, Cypress remplace volontairement
        // la réponse du backend par des données connues.
        cy.intercept('GET', 'http://localhost:3000/books', {
            statusCode: 200,
            body: [
                {
                    id: 1,
                    title: 'Dune',
                    author: 'Frank Herbert',
                    available_copies: 3,
                    total_copies: 3,
                },
            ],
        }).as('getBooks');

        // Ouvrir l'application
        cy.visit('http://localhost:4200');

        // Attendre la requête HTTP
        cy.wait('@getBooks');

        // Vérifier que le livre apparaît
        cy.get('.book-item')
            .should('have.length.at.least', 1)
            .and('contain.text', 'Dune');
    });

    // Ajouter un livre
    it('should add a book', () => {

        // Observer la requête POST sans modifier la réponse
        cy.intercept('POST', 'http://localhost:3000/books')
            .as('addBook');

        // Ouvrir l'application
        cy.visit('http://localhost:4200');

        // Accéder au formulaire
        cy.get('[data-cy="add-book"]').click();

        // Remplir les champs
        cy.get('[data-cy="title-input"]')
            .type('Le Seigneur des Anneaux');

        cy.get('[data-cy="author-input"]')
            .type('J.R.R. Tolkien');

        cy.get('[data-cy="copies-input"]')
            .clear()
            .type('5');

        // Envoyer le formulaire
        cy.get('[data-cy="submit-book"]').click();

        // Attendre la requête HTTP
        cy.wait('@addBook');

        // Vérifier que le livre apparaît dans la liste
        cy.contains('Le Seigneur des Anneaux')
            .should('be.visible');

        cy.contains('J.R.R. Tolkien')
            .should('be.visible');
    });

    // Supprimer un livre
    it('should remove a book from the list', () => {

        // Simuler une liste contenant un livre
        cy.intercept('GET', 'http://localhost:3000/books', {
            statusCode: 200,
            body: [
                {
                    id: 1,
                    title: 'Dune',
                    author: 'Frank Herbert',
                    available_copies: 3,
                    total_copies: 3,
                },
            ],
        }).as('getBooks');

        // Observer la requête DELETE
        cy.intercept('DELETE', '**/books/*')
            .as('deleteBook');

        // Ouvrir l'application
        cy.visit('http://localhost:4200');

        // Attendre le chargement de la liste
        cy.wait('@getBooks');

        // Vérifier que le livre est affiché
        cy.contains('Dune');

        // Cliquer sur Delete
        cy.contains('Delete').click();

        // Attendre la requête HTTP
        cy.wait('@deleteBook');

        //Vérifier que le livre n'est plus visible
        cy.contains('Dune')
            .should('not.exist');
    });

    // Emprunter un livre
    it('should decrease available copies when borrowing a book', () => {

        // Simuler une liste contenant un livre
        cy.intercept('GET', 'http://localhost:3000/books', {
            statusCode: 200,
            body: [
                {
                    id: 1,
                    title: 'Dune',
                    author: 'Frank Herbert',
                    available_copies: 3,
                    total_copies: 3,
                },
            ],
        }).as('getBooks');

        // Observer la requête d'emprunt
        cy.intercept('PUT', '**/borrow')
            .as('borrowBook');

        // Ouvrir l'application
        cy.visit('http://localhost:4200');

        // Attendre le chargement de la liste
        cy.wait('@getBooks');

        // Vérifier la présence du livre
        cy.contains('Dune');

        // Vérifier l'état initial (3 exemplaires disponibles)
        cy.get('.book-item')
            .should('contain.text', '3');

        // Cliquer sur Borrow
        cy.contains('Borrow').click();

        // Attendre la requête HTTP
        cy.wait('@borrowBook');

        // Vérifier que le nombre d'exemplaires a diminué
        cy.get('.book-item')
            .should('contain.text', '2');
    });
});

// Remarque :
// L'ordre est important :
// l'interception doit être déclarée avant cy.visit(),
// car le chargement de la page déclenche immédiatement
// l'appel à l'API.

// A retenir :

// cy.visit() → ouvrir une page
// cy.get() → sélectionner un élément
// cy.click() → cliquer
// cy.type() → saisir du texte
// cy.intercept() → surveiller une requête HTTP
// cy.wait() → attendre une requête HTTP
// cy.contains() → rechercher un texte

// Exemples :

// Ouvrir une page
// cy.visit('http://localhost:4200');

// Intercepter une requête
// cy.intercept('POST', 'http://localhost:3000/books').as('addBook');

// Cliquer
// cy.contains('Add Book').click();

// Saisir du texte
// cy.get('#title').type('Dune');

// Attendre une requête
// cy.wait('@addBook');

// Vérifier un texte
// cy.contains('Dune');