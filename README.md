# Personal Finance Tracker

A production-ready full-stack finance tracking application with RBAC, analytics, Redis caching, and secure JWT authentication.

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

## Admin Features

* Access all platform analytics
* View all user transactions
* Manage complete transaction records
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
https://finance-tracker-uuqc.onrender.com/api-docs/
```

---

# Local Setup Instructions

## 1. Clone Repository

```bash
git clone https://github.com/kartik417/finance-tracker.git
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
REDIS_URL=YOUR_REDIS_URL
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

* Email: [test@gmail.com](mailto:user@example.com)
* Password: Test@123

## Read-only

* Email: [read@gmail.com](mailto:user@example.com)
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
# Performance Metrics

## Redis Cache Performance

Analytics APIs use Redis caching for faster response times.

### Cache Duration

* Analytics Data → 15 Minutes
* Category Lists → 1 Hour

### Cache Monitoring

Server logs display:

* Cache HIT
* Cache MISS

This reduces database queries and improves API performance.

# Deployment

## Frontend
Deployed on Vercel

## Backend
Deployed on Render

## Database
PostgreSQL (Neon)

## Cache
Redis Cloud

---

# Live Demo

Frontend:
https://finance-tracker-three-jet.vercel.app

Backend API:
https://finance-tracker-uuqc.onrender.com

Swagger Docs:
https://finance-tracker-uuqc.onrender.com/api-docs/

Health Check:
https://finance-tracker-uuqc.onrender.com/api/health

---

# Author    

Kartik
