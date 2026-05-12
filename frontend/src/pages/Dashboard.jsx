import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";

import {
   FaArrowUp,
   FaArrowDown,
   FaWallet,
   FaReceipt,
   FaUserShield
} from "react-icons/fa";

import "./Dashboard.css";

function Dashboard() {

   const role = localStorage.getItem("role");

   const isAdmin = role === "admin";

   const [analytics, setAnalytics] = useState({
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
      totalTransactions: 0
   });

   const [loading, setLoading] = useState(true);

   useEffect(() => {

      fetchAnalytics();

      // auto refresh for admin
      let interval;

      if (isAdmin) {

         interval = setInterval(() => {

            fetchAnalytics();

         }, 5000);

      }

      return () => {

         if (interval) {
            clearInterval(interval);
         }

      };

   }, []);
   const fetchAnalytics = async () => {

      try {

         const token = localStorage.getItem("token");

         const response = await API.get(
            "/analytics",
            {
               headers: {
                  Authorization: `Bearer ${token}`
               }
            }
         );

         setAnalytics(response.data);

      } catch (error) {

         console.log(error);

      } finally {

         setLoading(false);
      }
   };

   return (

      <div className="dashboard-page">

         <div className="bg-circle circle1"></div>
         <div className="bg-circle circle2"></div>

         <Navbar />

         <div className="dashboard-container">

            {/* HEADER */}

            <div className="dashboard-header">

               <div>

                  <h1 className="dashboard-title">

                     {
                        isAdmin
                           ? "Admin Control Panel"
                           : "Finance Dashboard"
                     }

                  </h1>

                  <p className="dashboard-subtitle">

                     {
                        isAdmin
                           ? "Monitor all users, transactions and platform analytics"
                           : "Track your income, expenses and savings"
                     }

                  </p>

                  <p className="welcome-text">

                     Welcome back,
                     {
                        isAdmin
                           ? " Administrator 👑"
                           : " User 👋"
                     }

                  </p>

               </div>

            </div>

            {/* ADMIN BANNER */}

            {
               isAdmin && (

                  <div className="admin-banner">

                     <div>

                        <h2>
                           Global System Access
                        </h2>

                        <p>
                           You are viewing complete platform analytics
                        </p>

                     </div>

                     <span className="admin-badge">
                        ADMIN
                     </span>

                  </div>

               )
            }

            {/* LOADING */}

            {
               loading
                  ? (
                     <div className="loader-container">

                        <div className="loader"></div>

                        <p>
                           Loading analytics...
                        </p>

                     </div>
                  )
                  : (
                     <div className="cards-container">

                        {/* INCOME */}

                        <div className="card income">

                           <div className="card-icon">
                              <FaArrowUp />
                           </div>

                           <h2>

                              {
                                 isAdmin
                                    ? "Platform Income"
                                    : "Total Income"
                              }

                           </h2>

                           <p>
                              ₹ {analytics.totalIncome}
                           </p>

                        </div>

                        {/* EXPENSE */}

                        <div className="card expense">

                           <div className="card-icon">
                              <FaArrowDown />
                           </div>

                           <h2>

                              {
                                 isAdmin
                                    ? "Platform Expense"
                                    : "Total Expense"
                              }

                           </h2>

                           <p>
                              ₹ {analytics.totalExpense}
                           </p>

                        </div>

                        {/* BALANCE */}

                        <div className="card balance">

                           <div className="card-icon">
                              <FaWallet />
                           </div>

                           <h2>

                              {
                                 isAdmin
                                    ? "Platform Balance"
                                    : "Balance"
                              }

                           </h2>

                           <p>
                              ₹ {analytics.balance}
                           </p>

                        </div>

                        {/* TRANSACTIONS */}

                        <div className="card transactions">

                           <div className="card-icon">
                              <FaReceipt />
                           </div>

                           <h2>

                              {
                                 isAdmin
                                    ? "All Transactions"
                                    : "Total Transactions"
                              }

                           </h2>

                           <p>
                              {analytics.totalTransactions}
                           </p>

                        </div>

                        {/* ADMIN CARD */}

                        {
                           isAdmin && (

                              <div className="card admin-card">

                                 <div className="card-icon">
                                    <FaUserShield />
                                 </div>

                                 <h2>
                                    System Role
                                 </h2>

                                 <p>
                                    ADMIN
                                 </p>

                              </div>

                           )
                        }

                     </div>
                  )
            }

         </div>

      </div>
   );
}

export default Dashboard;