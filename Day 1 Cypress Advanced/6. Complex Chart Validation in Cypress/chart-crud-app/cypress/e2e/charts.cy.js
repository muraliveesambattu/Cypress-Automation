// cypress/e2e/charts.cy.js

describe('Sales Charts', () => {
  beforeEach(() => {
    // Intercept GET /api/sales before visiting the page
    cy.intercept('GET', '/api/sales').as('getSales');

    // baseUrl = http://localhost:3000 (from cypress.config.js)
    cy.visit('/');

    // Wait for the initial sales load
    cy.wait('@getSales');
  });

  // ----------------------------------------------------
  // TEST 1: Validate Canvas Chart (Chart.js)
  // ----------------------------------------------------
  it('validates canvas chart dataset (Chart.js)', () => {
    // Canvas should be present
    cy.get('#salesCanvas').should('exist');

    // Validate Chart.js internal data
    cy.window().then((win) => {
      const chart = win.salesChart;
      expect(chart, 'Chart instance should exist').to.exist;

      const labels = chart.data.labels;
      const data = chart.data.datasets[0].data;

      // Basic sanity checks
      expect(labels.length, 'labels length').to.be.greaterThan(0);
      expect(data.length, 'data length').to.equal(labels.length);

      // With our seed data, we expect these months
      expect(labels).to.include.members(['Jan', 'Feb', 'Mar']);
    });
  });

  // ----------------------------------------------------
  // TEST 2: Validate SVG Bar Chart
  // ----------------------------------------------------
  it('validates SVG chart bars and labels', () => {
    // Fetch current sales from the API
    cy.request('/api/sales').then((res) => {
      const sales = res.body;
      const expectedLabels = sales.map((s) => s.label);

      // 1️⃣ There should be at least one bar per label
      cy.get('#salesSvg .bar')
        .its('length')
        .should('be.gte', expectedLabels.length);

      // 2️⃣ Each label should appear as <text>
      expectedLabels.forEach((label) => {
        cy.get('#salesSvg text').contains(label).should('exist');
      });

      // 3️⃣ Optional relative height check for first 3 entries
      if (
        expectedLabels.includes('Jan') &&
        expectedLabels.includes('Feb') &&
        expectedLabels.includes('Mar')
      ) {
        cy.get('#salesSvg .bar').then(($bars) => {
          const heights = [...$bars].map((b) =>
            Number(b.getAttribute('height'))
          );

          if (heights.length >= 3) {
            const [janHeight, febHeight, marHeight] = heights;

            expect(marHeight).to.be.greaterThan(janHeight);
            expect(janHeight).to.be.greaterThan(febHeight);
          }
        });
      }
    });
  });

  // ----------------------------------------------------
  // TEST 3: CRUD → Charts Update
  // ----------------------------------------------------
  it('updates both charts after creating a sale', () => {
    cy.intercept('POST', '/api/sales').as('createSale');

    const newLabel = 'Apr';
    const newAmount = 200;

    // Submit the form to create a new sale
    cy.get('#label-input').clear().type(newLabel);
    cy.get('#amount-input').clear().type(String(newAmount));
    cy.get('#sales-form').submit();

    // Wait for create + reload
    cy.wait('@createSale');
    cy.wait('@getSales');

    // 1️⃣ Canvas chart: new label & value present
    cy.window().then((win) => {
      const chart = win.salesChart;
      const labels = chart.data.labels;
      const data = chart.data.datasets[0].data;

      expect(labels).to.include(newLabel);

      const idx = labels.indexOf(newLabel);
      expect(data[idx]).to.equal(newAmount);
    });

    // 2️⃣ SVG: we just assert that the label "Apr" is drawn
    cy.get('#salesSvg text').contains(newLabel).should('exist');

    // 3️⃣ Optional: SVG bars are at least as many as data points
    cy.request('/api/sales').then((res) => {
      const sales = res.body;
      cy.get('#salesSvg .bar')
        .its('length')
        .should('be.gte', sales.length);
    });
  });
});
