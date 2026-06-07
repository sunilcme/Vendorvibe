# VendorVibe 🎵

A modern B2B supplier portal where you can manage suppliers and their products, and customers can discover and browse them.

## 🚀 Features

- **Supplier Management**: Add, edit, and manage suppliers
- **Product Catalog**: Upload and organize products by supplier
- **Customer Portal**: Browse suppliers and their products
- **Authentication**: Secure login for suppliers and customers
- **Responsive Design**: Works on desktop and mobile
- **RESTful API**: Clean, scalable backend

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first styling
- **Vite** - Lightning-fast build tool
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Prisma** - ORM

## 📋 Project Structure

```
vendorvibe/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── types/           # TypeScript types
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
├── backend/                  # Express API
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── controllers/     # Business logic
│   │   ├── models/          # Database models
│   │   ├── middleware/      # Express middleware
│   │   └── server.ts
│   ├── package.json
│   └── .env.example
├── database/                 # Database setup
│   └── schema.sql
└── docker-compose.yml       # Docker configuration
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- PostgreSQL
- Git

### Setup Instructions

#### 1. Clone the repository
```bash
git clone https://github.com/sunilcme/vendorvibe.git
cd vendorvibe
```

#### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your database credentials
DATABASE_URL="postgresql://user:password@localhost:5432/vendorvibe"
JWT_SECRET="your-secret-key-here"
PORT=5000

# Start the backend
npm run dev
```

Backend runs on: `http://localhost:5000`

#### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000" > .env

# Start development server
npm run dev
```

Frontend runs on: `http://localhost:5173`

## 📚 API Endpoints

### Suppliers
- `GET /api/suppliers` - List all suppliers
- `GET /api/suppliers/:id` - Get supplier details
- `POST /api/suppliers` - Create supplier
- `PUT /api/suppliers/:id` - Update supplier
- `DELETE /api/suppliers/:id` - Delete supplier

### Products
- `GET /api/products` - List all products
- `GET /api/products?supplier_id=:id` - List products by supplier
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

## 🧑‍💻 Learning Path

1. **Start here**: Understand the project structure
2. **Frontend**: Learn React components and state management
3. **Backend**: Learn Express routing and middleware
4. **Database**: Understand SQL and ORM concepts
5. **Full-stack**: Connect everything together

## 📖 Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [PostgreSQL Docs](https://www.postgresql.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## 🐛 Troubleshooting

**Backend won't start?**
- Check if PostgreSQL is running
- Verify DATABASE_URL in .env

**Frontend won't connect?**
- Check if backend is running on port 5000
- Verify VITE_API_URL in .env

**Database connection error?**
- Verify PostgreSQL credentials
- Check if database 'vendorvibe' exists

## 📝 License

MIT License - Feel free to use this for learning!

---

Happy coding! 🚀 If you have questions, check the docs or open an issue.