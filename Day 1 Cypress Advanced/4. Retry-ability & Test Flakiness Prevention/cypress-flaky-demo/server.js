// server.js
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Serve static files from public
app.use(express.static(path.join(__dirname, 'public')));

// Fake users data
const users = [
  { id: 1, name: 'Sachin' },
  { id: 2, name: 'Dravid' },
  { id: 3, name: 'Kohli' },
];

// GET /api/users with random delay (500–2500ms)
app.get('/api/users', (req, res) => {
  const delay = 500 + Math.floor(Math.random() * 2000); // 500–2500
  console.log(`[/api/users] Responding in ${delay}ms`);

  setTimeout(() => {
    res.json(users);
  }, delay);
});

// GET /api/random-status - sometimes success, sometimes failure
app.get('/api/random-status', (req, res) => {
  const isSuccess = Math.random() > 0.5; // 50% chance

  if (isSuccess) {
    console.log('[/api/random-status] 200 OK');
    res.json({ status: 'ok', message: 'Sometimes I pass' });
  } else {
    console.log('[/api/random-status] 500 ERROR');
    res.status(500).json({ status: 'error', message: 'Sometimes I fail' });
  }
});

// Serve index.html for /
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
