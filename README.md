# Personal Finance Tracker

A full-stack Personal Finance Tracker application built with React, Node.js, Express, PostgreSQL, and Redis.

---

# Features

## User Authentication

* User Registration and Login
* JWT-based Authentication
* Protected Routes
* Role-Based Access Control (RBAC)

### Roles

* **Admin** → Access all users and transactions
* **User** → Manage only own transactions
* **Read-only** → View-only access

---

# Transaction Management

* Add Transactions
* Edit Transactions
* Delete Transactions
* Search Transactions
* Filter Transactions
* Pagination Support

---

# Analytics Dashboard

* Income vs Expense Overview
* Monthly Trends
* Category-wise Expense Breakdown
* Interactive Charts using Recharts

---

# Performance Features

* Redis Caching
* API Rate Limiting
* Lazy Loading
* Pagination
* Optimized Rendering using React Hooks

---

# Tech Stack

## Frontend

* React.js
* React Router DOM
* Recharts
* CSS

## Backend

* Node.js
* Express.js
* PostgreSQL
* Redis
* JWT Authentication

---

# React Hooks Used

* useState
* useEffect
* useContext
* useMemo
* useCallback

---

# API Documentation

Swagger API Documentation available at:

```bash
http://localhost:5000/api-docs
```

---

# Local Setup Instructions

## 1. Clone Repository

```bash
git clone YOUR_GITHUB_REPO_LINK
```

---

## 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```env
PORT=5000
DATABASE_URL=YOUR_DATABASE_URL
JWT_SECRET=YOUR_SECRET_KEY
REDIS_URL=redis://127.0.0.1:6379
```

Run backend:

```bash
npm run dev
```

---

## 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

# Demo Credentials

## Admin

* Email: [admin@gmail.com](mailto:admin@example.com)
* Password: Admin@123

## User

* Email: [testuser@gmail.com](mailto:user@example.com)
* Password: Test@123

## Read-only

* Email: [readonly@gmail.com](mailto:user@example.com)
* Password: Read@123

---

# Project Structure

```bash
finance-tracker/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   └── server.js
│
├── frontend/
│   ├── components/
│   ├── context/
│   ├── pages/
│   └── App.jsx
```

---

# Security Features

* JWT Authentication
* Protected API Routes
* Role-based Authorization
* SQL Injection Prevention using Parameterized Queries
* Helmet Security Middleware
* API Rate Limiting

---

# Deployment

## Frontend

* Vercel

## Backend

* Render

## Database

* PostgreSQL

---

# Author

Kartik
