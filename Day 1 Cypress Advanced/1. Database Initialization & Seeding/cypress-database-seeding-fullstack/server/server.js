const express = require('express');
const cors = require('cors');
const path = require('path');
const Database = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;
const db = new Database();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
// app.use(express.static(path.join(__dirname, 'public')));

// Initialize database connection
db.connect().catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});

// API Routes
if (process.env.NODE_ENV === "test") {
  app.post("/api/test/reset", async (req, res) => {
    const items = req.body.items || [];

    db.db.run("DELETE FROM items", async (err) => {
      if (err) {
        return res.status(500).json({ success: false, error: err.message });
      }

      if (items.length === 0) {
        return res.json({ success: true, data: [] });
      }

      const inserted = [];
      for (const item of items) {
        const created = await db.createItem(item.name, item.description || "");
        inserted.push(created);
      }

      res.json({ success: true, data: inserted });
    });
  });
}

// GET all items
app.get('/api/items', async (req, res) => {
  try {
    const items = await db.getAllItems();
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET single item by ID
app.get('/api/items/:id', async (req, res) => {
  try {
    const item = await db.getItemById(req.params.id);
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
});

// POST create new item
app.post('/api/items', async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ success: false, error: 'Name is required' });
    }

    const newItem = await db.createItem(name, description || '');
    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT update item
app.put('/api/items/:id', async (req, res) => {
  try {
    const { name, description } = req.body;
    const { id } = req.params;

    if (!name || name.trim() === '') {
      return res.status(400).json({ success: false, error: 'Name is required' });
    }

    const updatedItem = await db.updateItem(id, name, description || '');
    res.json({ success: true, data: updatedItem });
  } catch (error) {
    const statusCode = error.message === 'Item not found' ? 404 : 500;
    res.status(statusCode).json({ success: false, error: error.message });
  }
});

// DELETE item
app.delete('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.deleteItem(id);
    res.json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    const statusCode = error.message === 'Item not found' ? 404 : 500;
    res.status(statusCode).json({ success: false, error: error.message });
  }
});

// Root route - serve the frontend
app.get('/', (req, res) => {
  // res.sendFile(path.join(__dirname, 'public', 'index.html'));
  res.send({ msg: "Backend Working fine !!" })
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await db.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nShutting down gracefully...');
  await db.close();
  process.exit(0);
});

