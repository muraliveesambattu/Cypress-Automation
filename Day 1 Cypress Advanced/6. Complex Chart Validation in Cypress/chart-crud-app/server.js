const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static frontend from /public
app.use(express.static(path.join(__dirname, 'public')));

// In-memory "sales" data (CRUD target)
let sales = [
  { id: 1, label: 'Jan', amount: 120 },
  { id: 2, label: 'Feb', amount: 80 },
  { id: 3, label: 'Mar', amount: 150 },
];

// CRUD: GET all sales
app.get('/api/sales', (req, res) => {
  res.json(sales);
});

// CRUD: POST create
app.post('/api/sales', (req, res) => {
  const { label, amount } = req.body;
  const id = sales.length ? Math.max(...sales.map(s => s.id)) + 1 : 1;
  const newSale = { id, label, amount };
  sales.push(newSale);
  res.status(201).json(newSale);
});

// CRUD: PUT update
app.put('/api/sales/:id', (req, res) => {
  const id = Number(req.params.id);
  const { label, amount } = req.body;
  const index = sales.findIndex(s => s.id === id);
  if (index === -1) return res.status(404).json({ message: 'Not found' });
  sales[index] = { id, label, amount };
  res.json(sales[index]);
});

// CRUD: DELETE
app.delete('/api/sales/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = sales.findIndex(s => s.id === id);
  if (index === -1) return res.status(404).json({ message: 'Not found' });
  const deleted = sales.splice(index, 1)[0];
  res.json(deleted);
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
