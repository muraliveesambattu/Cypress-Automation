
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor(dbPath = null) {
    // Use test database in test environment, otherwise use default
    const env = process.env.NODE_ENV || 'development';
    const defaultPath = env === 'test' 
      ? path.join(__dirname, 'test.db')
      : path.join(__dirname, 'database.db');
    
    this.dbPath = dbPath || defaultPath;
    this.db = null;
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          console.error('Error opening database:', err.message);
          reject(err);
        } else {
          console.log(`Connected to SQLite database at ${this.dbPath}`);
          this.initTables().then(resolve).catch(reject);
        }
      });
    });
  }

  initTables() {
    return new Promise((resolve, reject) => {
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;

      this.db.run(createTableSQL, (err) => {
        if (err) {
          console.error('Error creating table:', err.message);
          reject(err);
        } else {
          console.log('Table initialized successfully');
          resolve();
        }
      });
    });
  }

  // CREATE - Insert a new item
  createItem(name, description) {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO items (name, description, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)`;
      this.db.run(sql, [name, description], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, name, description });
        }
      });
    });
  }

  // READ - Get all items
  getAllItems() {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM items ORDER BY created_at DESC`;
      this.db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // READ - Get a single item by ID
  getItemById(id) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM items WHERE id = ?`;
      this.db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
        } else if (!row) {
          reject(new Error('Item not found'));
        } else {
          resolve(row);
        }
      });
    });
  }

  // UPDATE - Update an item
  updateItem(id, name, description) {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE items SET name = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
      this.db.run(sql, [name, description, id], function(err) {
        if (err) {
          reject(err);
        } else if (this.changes === 0) {
          reject(new Error('Item not found'));
        } else {
          resolve({ id, name, description });
        }
      });
    });
  }

  // DELETE - Delete an item
  deleteItem(id) {
    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM items WHERE id = ?`;
      this.db.run(sql, [id], function(err) {
        if (err) {
          reject(err);
        } else if (this.changes === 0) {
          reject(new Error('Item not found'));
        } else {
          resolve({ id, deleted: true });
        }
      });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            reject(err);
          } else {
            console.log('Database connection closed');
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }
}

module.exports = Database;

