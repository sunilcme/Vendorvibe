import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Backend is running! 🚀' });
});

// ============ SUPPLIERS ROUTES ============

// Get all suppliers
app.get('/api/suppliers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM suppliers ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ error: 'Failed to fetch suppliers' });
  }
});

// Get supplier by ID
app.get('/api/suppliers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM suppliers WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching supplier:', error);
    res.status(500).json({ error: 'Failed to fetch supplier' });
  }
});

// Create supplier
app.post('/api/suppliers', async (req, res) => {
  try {
    const { name, email, phone, website, description, logo_url } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const result = await pool.query(
      'INSERT INTO suppliers (name, email, phone, website, description, logo_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, email, phone || null, website || null, description || null, logo_url || null]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating supplier:', error);
    res.status(500).json({ error: 'Failed to create supplier' });
  }
});

// Update supplier
app.put('/api/suppliers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, website, description, logo_url } = req.body;
    
    const result = await pool.query(
      'UPDATE suppliers SET name = $1, email = $2, phone = $3, website = $4, description = $5, logo_url = $6, updated_at = NOW() WHERE id = $7 RETURNING *',
      [name, email, phone, website, description, logo_url, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating supplier:', error);
    res.status(500).json({ error: 'Failed to update supplier' });
  }
});

// Delete supplier
app.delete('/api/suppliers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // First delete all products of this supplier
    await pool.query('DELETE FROM products WHERE supplier_id = $1', [id]);
    
    // Then delete the supplier
    const result = await pool.query('DELETE FROM suppliers WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    
    res.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    res.status(500).json({ error: 'Failed to delete supplier' });
  }
});

// ============ PRODUCTS ROUTES ============

// Get all products (with optional supplier filter)
app.get('/api/products', async (req, res) => {
  try {
    const { supplier_id } = req.query;
    
    let query = 'SELECT p.*, s.name as supplier_name FROM products p JOIN suppliers s ON p.supplier_id = s.id';
    let params: any[] = [];
    
    if (supplier_id) {
      query += ' WHERE p.supplier_id = $1';
      params = [supplier_id];
    }
    
    query += ' ORDER BY p.created_at DESC';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT p.*, s.name as supplier_name FROM products p JOIN suppliers s ON p.supplier_id = s.id WHERE p.id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create product
app.post('/api/products', async (req, res) => {
  try {
    const { supplier_id, name, description, price, stock, category, image_url } = req.body;
    
    if (!supplier_id || !name || !price) {
      return res.status(400).json({ error: 'Supplier ID, name, and price are required' });
    }

    const result = await pool.query(
      'INSERT INTO products (supplier_id, name, description, price, stock, category, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [supplier_id, name, description || null, price, stock || 0, category || null, image_url || null]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product
app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category, image_url } = req.body;
    
    const result = await pool.query(
      'UPDATE products SET name = $1, description = $2, price = $3, stock = $4, category = $5, image_url = $6, updated_at = NOW() WHERE id = $7 RETURNING *',
      [name, description, price, stock, category, image_url, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ VendorVibe Backend running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
