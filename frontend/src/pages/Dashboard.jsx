import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import "./Dashboard.css";

function Dashboard() {

   const [analytics, setAnalytics] = useState({
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
      totalTransactions: 0
   });

   useEffect(() => {

      fetchAnalytics();

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

      }
   };

   return (

      <div className="dashboard-page">

         <Navbar />

         <div className="dashboard-container">

            <h1 className="dashboard-title">
               Finance Dashboard
            </h1>

            <div className="cards-container">

               <div className="card income">
                  <h2>Total Income</h2>
                  <p>₹ {analytics.totalIncome}</p>
               </div>

               <div className="card expense">
                  <h2>Total Expense</h2>
                  <p>₹ {analytics.totalExpense}</p>
               </div>

               <div className="card balance">
                  <h2>Balance</h2>
                  <p>₹ {analytics.balance}</p>
               </div>

               <div className="card transactions">
                  <h2>Total Transactions</h2>
                  <p>{analytics.totalTransactions}</p>
               </div>

            </div>

         </div>

      </div>
   );
}

export default Dashboard;