import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import App from './App.jsx'
import AuthProvider from "./context/AuthContext";
import ThemeProvider from "./context/ThemeContext";
import { Toaster } from "react-hot-toast";
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          reverseOrder={false}
        />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
