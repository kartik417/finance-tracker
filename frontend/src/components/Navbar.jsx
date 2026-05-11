import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {

   const navigate = useNavigate();

   const { logout } = useContext(AuthContext);

   const handleLogout = () => {

      logout();

      navigate("/");

   };

   return (

      <nav className="navbar">

         <h2 className="logo">
            FinanceTracker
         </h2>

         <div className="nav-links">

            <Link to="/dashboard">
               Dashboard
            </Link>

            <Link to="/transactions">
               Transactions
            </Link>

            <Link to="/analytics">
               Analytics
            </Link>

         </div>

         <button
            className="logout-btn"
            onClick={handleLogout}
         >
            Logout
         </button>

      </nav>
   );
}

export default Navbar;