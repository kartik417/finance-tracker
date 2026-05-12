import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import API from "../api/axios";
import "./Analytics.css";
import {
   PieChart,
   Pie,
   Cell,
   Tooltip,
   Legend,
   BarChart,
   Bar,
   XAxis,
   YAxis,
   CartesianGrid,
   LineChart,
   Line,
   ResponsiveContainer
} from "recharts";

function Analytics() {
   const role = localStorage.getItem("role");

   const isAdmin = role === "admin";
   const [analytics, setAnalytics] = useState(null);

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

   if (!analytics) {

      return (

         <div className="loading-screen">

            <div className="loader"></div>

            <h2>Loading Analytics...</h2>

         </div>

      );
   }

   // pie chart
   const pieData = [
      {
         name: "Income",
         value: analytics.totalIncome
      },
      {
         name: "Expense",
         value: analytics.totalExpense
      }
   ];

   // monthly chart
   const monthlyChartData =
      Object.entries(analytics.monthlyData)
         .map(([month, values]) => ({
            month,
            income: values.income,
            expense: values.expense
         }));

   // category chart
   const categoryChartData =
      Object.entries(analytics.categoryData)
         .map(([category, amount]) => ({
            category,
            amount
         }));

   const COLORS = ["#00C49F", "#FF4D4D"];

   return (

      <div className="analytics-page">

         <Navbar />

         <div className="analytics-container">

            {/* TITLE */}

            <h1 className="analytics-title">

               {
                  isAdmin
                     ? "Platform Analytics"
                     : "Analytics Dashboard"
               }

            </h1>

            {/* ADMIN BANNER */}

            {
               isAdmin && (

                  <div className="admin-banner">

                     <div>

                        <h2>
                           Global Analytics Access
                        </h2>

                        <p>
                           Viewing complete platform financial data
                        </p>

                     </div>

                     <span className="admin-badge">
                        ADMIN
                     </span>

                  </div>

               )
            }

            {/* PIE CHART */}

            <div className="chart-card">

               <h2>

                  {
                     isAdmin
                        ? "Platform Income vs Expense"
                        : "Income vs Expense"
                  }

               </h2>

               <div className="chart-wrapper">

                  <ResponsiveContainer
                     width="100%"
                     height={400}
                  >

                     <PieChart>

                        <Pie
                           data={pieData}
                           cx="50%"
                           cy="50%"
                           outerRadius={120}
                           dataKey="value"
                           label
                        >

                           {
                              pieData.map((entry, index) => (

                                 <Cell
                                    key={index}
                                    fill={
                                       COLORS[index % COLORS.length]
                                    }
                                 />

                              ))
                           }

                        </Pie>

                        <Tooltip />

                        <Legend />

                     </PieChart>

                  </ResponsiveContainer>

               </div>

            </div>

            {/* BAR CHART */}

            <div className="chart-card">

               <h2>

                  {
                     isAdmin
                        ? "Platform Expense Categories"
                        : "Category Expenses"
                  }

               </h2>

               <div className="chart-wrapper">

                  <ResponsiveContainer
                     width="100%"
                     height={350}
                  >

                     <BarChart
                        data={categoryChartData}
                     >

                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="category" />

                        <YAxis />

                        <Tooltip />

                        <Legend />

                        <Bar
                           dataKey="amount"
                           fill="#8884d8"
                           radius={[10, 10, 0, 0]}
                        />

                     </BarChart>

                  </ResponsiveContainer>

               </div>

            </div>

            {/* LINE CHART */}

            <div className="chart-card">

               <h2>

                  {
                     isAdmin
                        ? "Platform Monthly Trends"
                        : "Monthly Trends"
                  }

               </h2>

               <div className="chart-wrapper">

                  <ResponsiveContainer
                     width="100%"
                     height={350}
                  >

                     <LineChart
                        data={monthlyChartData}
                     >

                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="month" />

                        <YAxis />

                        <Tooltip />

                        <Legend />

                        <Line
                           type="monotone"
                           dataKey="income"
                           stroke="#00C49F"
                           strokeWidth={3}
                        />

                        <Line
                           type="monotone"
                           dataKey="expense"
                           stroke="#FF4D4D"
                           strokeWidth={3}
                        />

                     </LineChart>

                  </ResponsiveContainer>

               </div>

            </div>

         </div>

      </div>
   );
}

export default Analytics;