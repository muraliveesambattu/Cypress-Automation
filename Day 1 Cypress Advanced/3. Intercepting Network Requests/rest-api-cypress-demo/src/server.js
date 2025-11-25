const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

// In-memory "database"
let users = [
  { id: 1, name: "Alice", age: 25 },
  { id: 2, name: "Bob", age: 30 }
];
let nextId = 3;

// GET /users - list all users
app.get("/users", (req, res) => {
  res.json(users);
});

// POST /users - create new user
app.post("/users", (req, res) => {
  const { name, age } = req.body;

  // Simple validation (for 400 test)
  if (!name || typeof age !== "number") {
    return res.status(400).json({
      error: "Invalid payload: 'name' (string) and 'age' (number) are required."
    });
  }

  const newUser = { id: nextId++, name, age };
  users.push(newUser);
  res.status(201).json(newUser);
});

// PUT /users/:id - update user
app.put("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const { name, age } = req.body;

  const userIndex = users.findIndex((u) => u.id === id);
  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  if (!name && typeof age !== "number") {
    return res.status(400).json({
      error: "At least one of 'name' or 'age' must be provided."
    });
  }

  const existingUser = users[userIndex];
  const updatedUser = {
    ...existingUser,
    name: name ?? existingUser.name,
    age: typeof age === "number" ? age : existingUser.age
  };

  users[userIndex] = updatedUser;
  res.json(updatedUser);
});

// DELETE /users/:id - delete user
app.delete("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const userIndex = users.findIndex((u) => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  users.splice(userIndex, 1);
  res.status(204).send(); // No content
});

// Start server
app.listen(PORT, () => {
  console.log(`REST API running at http://localhost:${PORT}`);
});
