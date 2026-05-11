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
   Line
} from "recharts";

function Analytics() {

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

      } catch(error){

         console.log(error);

      }
   };

   if(!analytics){
      return <h1>Loading...</h1>;
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

         <h1 className="analytics-title">
            Analytics Dashboard
         </h1>

         {/* PIE CHART */}

         <div className="chart-card">

            <h2>
               Income vs Expense
            </h2>

            <div className="chart-wrapper">

               <PieChart width={400} height={400}>

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

            </div>

         </div>

         {/* BAR CHART */}

         <div className="chart-card">

            <h2>
               Category Expenses
            </h2>

            <div className="chart-wrapper">

               <BarChart
                  width={700}
                  height={350}
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

            </div>

         </div>

         {/* LINE CHART */}

         <div className="chart-card">

            <h2>
               Monthly Trends
            </h2>

            <div className="chart-wrapper">

               <LineChart
                  width={800}
                  height={350}
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

            </div>

         </div>

      </div>

   </div>
);
}

export default Analytics;