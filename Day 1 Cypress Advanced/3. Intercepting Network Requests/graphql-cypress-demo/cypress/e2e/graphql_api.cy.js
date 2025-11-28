// cypress/e2e/graphql_api.cy.js

const GRAPHQL_URL = 'http://localhost:4000/graphql'; 
// 👆 Change the port if your server runs on a different one

// ------------------------------------------------------
// 1. REAL API TESTING WITH cy.request()
// ------------------------------------------------------
describe('GraphQL API Testing with cy.request', () => {
  it('Fetches users (real API)', () => {
    const query = `
      query GetUsers {
        users {
          id
          name
          age
          isMarried
        }
      }
    `;

    cy.request({
      method: 'POST',
      url: GRAPHQL_URL,
      body: { query },
      headers: { 'Content-Type': 'application/json' },
    }).then((response) => {
      // HTTP status
      expect(response.status).to.eq(200);

      // Response structure
      expect(response.body).to.have.property('data');
      expect(response.body.data).to.have.property('users');

      const users = response.body.data.users;
      expect(users).to.be.an('array');

      const user = users[0];
      expect(user).to.have.all.keys('id', 'name', 'age', 'isMarried');
    });
  });

  it('Creates a user (real API)', () => {
    const mutation = `
      mutation CreateUser($input: UserInput!) {
        createUser(input: $input) {
          id
          name
          age
          isMarried
        }
      }
    `;

    const variables = {
      input: {
        name: 'Murali Test',
        age: 28,
        isMarried: false,
      },
    };

    cy.request({
      method: 'POST',
      url: GRAPHQL_URL,
      body: { query: mutation, variables },
      headers: { 'Content-Type': 'application/json' },
    }).then((response) => {
      expect(response.status).to.eq(200);

      const created = response.body.data.createUser;
      expect(created.name).to.eq('Murali Test');
      expect(created.age).to.eq(28);
      expect(created.isMarried).to.eq(false);
      expect(created.id).to.be.a('string');
    });
  });
});

// ------------------------------------------------------
// 2. MOCKING GRAPHQL WITH cy.intercept() + UI
// ------------------------------------------------------
//
// This assumes your Node server serves public/index.html:
//
// app.use(express.static(path.join(__dirname, 'public')));
//
// And public/index.html makes a POST /graphql fetch when clicking #load-users
// ------------------------------------------------------

describe('Mocking GraphQL with cy.intercept (UI)', () => {
  it('Mocks users query & verifies request + response payloads', () => {
    // 1️⃣ Intercept browser requests to /graphql
    cy.intercept('POST', '/graphql', (req) => {
      // --- Verify REQUEST payload (GraphQL query) ---
      expect(req.body).to.have.property('query');
      expect(req.body.query).to.include('users');

      // --- Mock RESPONSE payload ---
      req.reply({
        statusCode: 200,
        body: {
          data: {
            users: [
              {
                id: '999',
                name: 'Mock User',
                age: 99,
                isMarried: false,
              },
            ],
          },
        },
      });
    }).as('UsersQuery');

    // 2️⃣ Visit the demo UI page served by your Node app
    cy.visit('http://localhost:4000/index.html'); // change port if needed

    // 3️⃣ Trigger the GraphQL request by clicking the button
    cy.get('#load-users').click();

    // 4️⃣ Wait for the intercepted request and inspect it
    cy.wait('@UsersQuery').then(({ request, response }) => {
      // --- Request verification ---
      expect(request.body.query).to.include('GetUsers');

      // --- Response verification ---
      const users = response.body.data.users;
      expect(users).to.have.length(1);

      const mockUser = users[0];
      expect(mockUser.name).to.eq('Mock User');
      expect(mockUser.age).to.eq(99);
      expect(mockUser.isMarried).to.eq(false);
    });

    // 5️⃣ (Optional) Verify UI displays mocked data
    cy.get('#output').should('contain', 'Mock User');
  });
});
