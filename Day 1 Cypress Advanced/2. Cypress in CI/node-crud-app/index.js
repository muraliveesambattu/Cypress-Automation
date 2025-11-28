const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON body
app.use(express.json());
app.use(express.static('public'));


// In-memory "database"
let users = [
  { id: 1, name: 'Murali', email: 'murali@example.com' },
  { id: 2, name: 'John Doe', email: 'john@example.com' }
];
let nextId = 3;

// Health check
app.get('/', (req, res) => {
  res.send('Simple Node.js CRUD API is running 🚀');
});

// GET /users - get all users
app.get('/users', (req, res) => {
  res.json(users);
});

// GET /users/:id - get user by id
app.get('/users/:id', (req, res) => {
  const id = Number(req.params.id);
  const user = users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(user);
});

// POST /users - create a new user
app.post('/users', (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'name and email are required' });
  }

  const newUser = {
    id: nextId++,
    name,
    email
  };

  users.push(newUser);
  res.status(201).json(newUser);
});

// PUT /users/:id - update a user
app.put('/users/:id', (req, res) => {
  const id = Number(req.params.id);
  const { name, email } = req.body;

  const userIndex = users.findIndex(u => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  const updatedUser = {
    ...users[userIndex],
    name: name ?? users[userIndex].name,
    email: email ?? users[userIndex].email
  };

  users[userIndex] = updatedUser;

  res.json(updatedUser);
});

// DELETE /users/:id - delete a user
app.delete('/users/:id', (req, res) => {
  const id = Number(req.params.id);
  const userIndex = users.findIndex(u => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  users.splice(userIndex, 1);
  res.status(204).send(); // no body
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
