const createItemViaApi = (overrides = {}) => {
  const payload = {
    name: `API Item ${Cypress._.uniqueId()}`,
    description: 'Created via API test',
    ...overrides,
  };

  return cy
    .request({
      method: 'POST',
      url: '/api/items',
      body: payload,
    })
    .then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.include({
        name: payload.name,
        description: payload.description,
      });

      return response.body.data;
    });
};

describe('Items API CRUD', () => {
  const createdItemIds = [];

  const trackItem = (item) => {
    createdItemIds.push(item.id);
    return item;
  };

  afterEach(() => {
    if (!createdItemIds.length) {
      return;
    }

    const idsToDelete = [...createdItemIds];
    createdItemIds.length = 0;

    cy.wrap(idsToDelete).each((id) => {
      cy.request({
        method: 'DELETE',
        url: `/api/items/${id}`,
        failOnStatusCode: false,
      });
    });
  });

  it('lists items returned by the API', () => {
    const createdNames = [];

    cy.wrap(null)
      .then(() => createItemViaApi({ name: 'List Item 1' }))
      .then(trackItem)
      .then((item) => createdNames.push(item.name))
      .then(() => createItemViaApi({ name: 'List Item 2' }))
      .then(trackItem)
      .then((item) => createdNames.push(item.name))
      .then(() => cy.request('/api/items'))
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.success).to.be.true;

        const responseNames = response.body.data.map((item) => item.name);
        createdNames.forEach((name) => {
          expect(responseNames).to.include(name);
        });
      });
  });

  it('reads a single item by id', () => {
    cy.wrap(null)
      .then(() => createItemViaApi())
      .then(trackItem)
      .then((created) =>
        cy.request(`/api/items/${created.id}`).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.success).to.be.true;
          expect(response.body.data).to.include({
            id: created.id,
            name: created.name,
            description: created.description,
          });
        })
      );
  });

  it('creates a new item', () => {
    cy.wrap(null)
      .then(() => createItemViaApi({ description: 'Created via test case' }))
      .then(trackItem)
      .then((created) =>
        cy.request(`/api/items/${created.id}`).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.data).to.include({
            id: created.id,
            name: created.name,
            description: 'Created via test case',
          });
        })
      );
  });

  it('updates an existing item', () => {
    cy.wrap(null)
      .then(() => createItemViaApi())
      .then(trackItem)
      .then((created) => {
        const updatedPayload = {
          name: `${created.name} Updated`,
          description: 'Updated via API test',
        };

        return cy
          .request({
            method: 'PUT',
            url: `/api/items/${created.id}`,
            body: updatedPayload,
          })
          .then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.success).to.be.true;
            expect(response.body.data).to.include(updatedPayload);
          })
          .then(() =>
            cy.request(`/api/items/${created.id}`).then((response) => {
              expect(response.body.data).to.include(updatedPayload);
            })
          );
      });
  });

  it('deletes an existing item', () => {
    cy.wrap(null)
      .then(() => createItemViaApi())
      .then(trackItem)
      .then((created) =>
        cy
          .request({
            method: 'DELETE',
            url: `/api/items/${created.id}`,
          })
          .then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.success).to.be.true;
            expect(response.body.message).to.eq('Item deleted successfully');
          })
          .then(() =>
            cy.request({
              method: 'GET',
              url: `/api/items/${created.id}`,
              failOnStatusCode: false,
            })
          )
          .then((response) => {
            expect(response.status).to.eq(404);
            expect(response.body.success).to.be.false;
            expect(response.body.error).to.eq('Item not found');

            const idx = createdItemIds.indexOf(created.id);
            if (idx > -1) {
              createdItemIds.splice(idx, 1);
            }
          })
      );
  });
});