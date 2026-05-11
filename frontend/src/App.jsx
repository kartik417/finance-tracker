import { BrowserRouter, Routes, Route } from "react-router-dom";

import { lazy, Suspense } from "react";

import ProtectedRoute from "./components/ProtectedRoute";

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Transactions = lazy(() => import("./pages/Transactions"));
const Analytics = lazy(() => import("./pages/Analytics"));

function App() {

  return (

    <BrowserRouter>

      <Suspense fallback={<h1>Loading...</h1>}>

        <Routes>

          <Route path="/" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            }
          />

          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />

        </Routes>

      </Suspense>

    </BrowserRouter>

  );
}

export default App;