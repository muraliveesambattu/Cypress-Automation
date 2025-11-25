// server.js
const express = require("express");
const app = express();

app.use(express.json());

// Simple health-check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Very simple login endpoint
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "secret") {
    return res.json({ success: true, message: "Login successful" });
  }

  return res.status(401).json({ success: false, message: "Invalid credentials" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
