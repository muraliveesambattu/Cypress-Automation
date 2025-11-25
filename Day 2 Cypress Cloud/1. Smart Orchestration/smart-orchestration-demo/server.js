// server.js
const express = require('express');
const app = express();
const PORT = 4000;

app.use(express.json());

// In-memory "database"
let items = [];
let currentId = 1;

// CREATE
app.post('/api/items', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  const newItem = { id: currentId++, name };
  items.push(newItem);
  res.status(201).json(newItem);
});

// READ ALL
app.get('/api/items', (req, res) => {
  res.json(items);
});

// READ ONE
app.get('/api/items/:id', (req, res) => {
  const id = Number(req.params.id);
  const item = items.find(i => i.id === id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  res.json(item);
});

// UPDATE
app.put('/api/items/:id', (req, res) => {
  const id = Number(req.params.id);
  const { name } = req.body;

  const item = items.find(i => i.id === id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  if (!name) return res.status(400).json({ error: 'Name is required' });

  item.name = name;
  res.json(item);
});

// DELETE
app.delete('/api/items/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = items.findIndex(i => i.id === id);
  if (index === -1) return res.status(404).json({ error: 'Item not found' });

  items.splice(index, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});

