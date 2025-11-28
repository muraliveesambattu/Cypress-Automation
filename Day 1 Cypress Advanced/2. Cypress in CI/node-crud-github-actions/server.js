const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

let users = [
    { id: 1, name: "Murali", email: "murali@example.com" },
    { id: 2, name: "John", email: "john@example.com" }
];
let nextId = 3;

// Health check
app.get("/", (req, res) => {
    res.send("Node CRUD App is running");
});

// GET all users
app.get("/api/users", (req, res) => {
    res.json(users);
});

// GET user by ID
app.get("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const user = users.find(u => u.id === id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
});

// POST create user
app.post("/api/users", (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ message: "name and email are required" });
    }
    const newUser = { id: nextId++, name, email };
    users.push(newUser);
    res.status(201).json(newUser);
});

// PUT update user
app.put("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const { name, email } = req.body;
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) return res.status(404).json({ message: "User not found" });

    users[userIndex] = { ...users[userIndex], name, email };
    res.json(users[userIndex]);
});

// DELETE user
app.delete("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) return res.status(404).json({ message: "User not found" });

    const deleted = users[userIndex];
    users.splice(userIndex, 1);
    res.json(deleted);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
