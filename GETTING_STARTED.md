# Getting Started with VendorVibe 🎵

## System Requirements

- **Node.js**: v16 or higher
- **PostgreSQL**: v12 or higher
- **Git**: For version control
- **npm**: v7 or higher

## Option 1: Quick Setup (Docker) ⚡

If you have Docker installed, this is the fastest way:

```bash
# Clone the repository
git clone https://github.com/sunilcme/vendorvibe.git
cd vendorvibe

# Start all services
docker-compose up

# The app will be available at:
# Frontend: http://localhost:5173
# Backend: http://localhost:5000
# Database: localhost:5432
```

## Option 2: Manual Setup (Recommended for Learning) 📚

### Step 1: Install PostgreSQL

**macOS (with Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Ubuntu/Debian:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start
```

**Windows:**
Download from [postgresql.org](https://www.postgresql.org/download/windows/)

### Step 2: Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# In the PostgreSQL shell:
CREATE DATABASE vendorvibe;
\c vendorvibe
\i database/schema.sql
\q
```

### Step 3: Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and update with your database credentials:
# DATABASE_URL=postgresql://postgres:password@localhost:5432/vendorvibe
# JWT_SECRET=your-secret-key-change-in-production

# Start backend
npm run dev
```

You should see:
```
✅ VendorVibe Backend running on http://localhost:5000
📊 Health check: http://localhost:5000/health
```

### Step 4: Setup Frontend (in a new terminal)

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000" > .env

# Start frontend
npm run dev
```

You should see:
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

## Testing Your Setup

1. **Open your browser** and go to `http://localhost:5173`
2. **You should see the VendorVibe dashboard** 🎉
3. **Try adding a supplier**:
   - Fill in the form with sample data
   - Click "Add Supplier"
   - See it appear in the list below

4. **Try adding a product**:
   - Switch to "Products" tab
   - Select a supplier
   - Fill in product details
   - Click "Add Product"

## Project Structure Deep Dive

### Backend (`backend/src/server.ts`)

```
Routes:
├── GET /api/suppliers           - Get all suppliers
├── POST /api/suppliers          - Create supplier
├── PUT /api/suppliers/:id       - Update supplier
├── DELETE /api/suppliers/:id    - Delete supplier
├── GET /api/products            - Get all products
├── POST /api/products           - Create product
├── PUT /api/products/:id        - Update product
└── DELETE /api/products/:id     - Delete product
```

### Frontend (`frontend/src/App.tsx`)

- Single React component managing:
  - Supplier list and form
  - Product list and form
  - Tab navigation
  - API calls with Axios
  - Form state management

### Database (`database/schema.sql`)

```sql
Tables:
├── suppliers (id, name, email, phone, website, description, logo_url)
└── products (id, supplier_id, name, description, price, stock, category, image_url)
```

## Learning Path

### Week 1: Basics
- [ ] Understand React components and state
- [ ] Learn how forms work in React
- [ ] Understand API calls with Axios

### Week 2: Backend
- [ ] Learn Express routing
- [ ] Understand middleware
- [ ] Learn SQL queries

### Week 3: Full-stack
- [ ] Understand authentication (JWT)
- [ ] Learn error handling
- [ ] Implement better validation

### Week 4: Advanced
- [ ] Add file uploads
- [ ] Add search/filtering
- [ ] Add pagination
- [ ] Deploy to production

## Common Issues & Solutions

### "Cannot connect to database"
```bash
# Check if PostgreSQL is running
psql -U postgres -c "SELECT 1"

# If not running:
# macOS: brew services start postgresql@15
# Ubuntu: sudo service postgresql start
# Windows: Check Services app
```

### "Port 5000 already in use"
```bash
# Change PORT in backend/.env
PORT=5001

# And update frontend/.env
VITE_API_URL=http://localhost:5001
```

### "Cannot find module"
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

1. **Explore the code** - Read through `backend/src/server.ts` and `frontend/src/App.tsx`
2. **Add features** - Try implementing:
   - Search functionality
   - Filtering by category
   - User authentication
   - Image uploads
3. **Learn more** - Check the resources in README.md
4. **Deploy** - Learn how to deploy to Heroku, Vercel, or AWS

## Need Help?

- Check the README.md for resources
- Read Express.js and React documentation
- Look at the code comments
- Search for similar issues on Stack Overflow

Happy Learning! 🚀
