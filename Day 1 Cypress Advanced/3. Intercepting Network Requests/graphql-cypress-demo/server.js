// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const { buildSchema } = require('graphql');
const { graphqlHTTP } = require('express-graphql');

const app = express();
app.use(cors());
app.use(express.json());

// 👉 Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// 1) GraphQL schema
const schema = buildSchema(`
  type User {
    id: ID!
    name: String!
    age: Int!
    isMarried: Boolean!
  }

  input UserInput {
    name: String!
    age: Int!
    isMarried: Boolean!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
  }

  type Mutation {
    createUser(input: UserInput!): User!
    updateUser(id: ID!, input: UserInput!): User!
    deleteUser(id: ID!): Boolean!
  }
`);

// 2) In-memory database
let users = [
  { id: '1', name: 'Alice', age: 25, isMarried: false },
  { id: '2', name: 'Bob', age: 30, isMarried: true },
];

let nextId = 3;

// 3) Resolvers
const root = {
  users: () => users,
  user: ({ id }) => users.find(u => u.id === id),

  createUser: ({ input }) => {
    const newUser = { id: String(nextId++), ...input };
    users.push(newUser);
    return newUser;
  },

  updateUser: ({ id, input }) => {
    const index = users.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');
    users[index] = { ...users[index], ...input };
    return users[index];
  },

  deleteUser: ({ id }) => {
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return false;
    users.splice(index, 1);
    return true;
  },
};

// 4) GraphQL endpoint
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  })
);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`GraphQL at http://localhost:${PORT}/graphql`);
});
