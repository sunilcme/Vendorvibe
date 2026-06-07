-- Create database
CREATE DATABASE vendorvibe;

-- Connect to database
\c vendorvibe

-- Suppliers table
CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    website VARCHAR(255),
    description TEXT,
    logo_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    supplier_id INTEGER NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INTEGER DEFAULT 0,
    category VARCHAR(100),
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_products_supplier_id ON products(supplier_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_suppliers_email ON suppliers(email);

-- Sample data (optional)
INSERT INTO suppliers (name, email, phone, website, description) VALUES
('TechSupplies Inc', 'contact@techsupplies.com', '+1-555-0101', 'https://techsupplies.com', 'Leading technology supplier'),
('Quality Electronics', 'sales@qualityelectronics.com', '+1-555-0102', 'https://qualityelectronics.com', 'Premium electronics distributor'),
('Global Goods', 'info@globalgoods.com', '+1-555-0103', 'https://globalgoods.com', 'Worldwide merchandise distributor');

INSERT INTO products (supplier_id, name, description, price, stock, category) VALUES
(1, 'USB-C Cable', 'High-quality USB-C charging cable', 9.99, 100, 'Cables'),
(1, 'Wireless Mouse', 'Ergonomic wireless mouse', 29.99, 50, 'Peripherals'),
(2, 'LED Monitor', '27" Full HD LED Monitor', 199.99, 15, 'Monitors'),
(2, 'Mechanical Keyboard', 'RGB Mechanical Gaming Keyboard', 89.99, 30, 'Keyboards'),
(3, 'Phone Case', 'Durable protective phone case', 14.99, 200, 'Accessories'),
(3, 'Screen Protector', 'Tempered glass screen protector', 7.99, 300, 'Accessories');
