const pool = require("../config/db");


const getFinancialContext = async (
   userId,
   dateRange
) => {

   let transactionsResult;


   // =========================
   // MONTH
   // =========================

   if (dateRange.type === "month") {

      transactionsResult =
         await pool.query(
            `SELECT
               id,
               title,
               amount,
               type,
               category,
               created_at
             FROM transactions
             WHERE user_id = $1
             AND EXTRACT(MONTH FROM created_at) = $2
             AND EXTRACT(YEAR FROM created_at) = $3
             ORDER BY created_at DESC`,
            [
               userId,
               dateRange.month,
               dateRange.year
            ]
         );

   }


   // =========================
   // YEAR
   // =========================

   else if (
      dateRange.type === "year"
   ) {

      transactionsResult =
         await pool.query(
            `SELECT
               id,
               title,
               amount,
               type,
               category,
               created_at
             FROM transactions
             WHERE user_id = $1
             AND EXTRACT(YEAR FROM created_at) = $2
             ORDER BY created_at DESC`,
            [
               userId,
               dateRange.year
            ]
         );

   }


   // =========================
   // DATE RANGE
   // Financial Year etc.
   // =========================

   else if (
      dateRange.type === "range"
   ) {

      transactionsResult =
         await pool.query(
            `SELECT
               id,
               title,
               amount,
               type,
               category,
               created_at
             FROM transactions
             WHERE user_id = $1
             AND created_at >= $2
             AND created_at < ($3::date + INTERVAL '1 day')
             ORDER BY created_at DESC`,
            [
               userId,
               dateRange.startDate,
               dateRange.endDate
            ]
         );

   }


   const transactions =
      transactionsResult.rows;


   // =========================
   // TOTAL INCOME
   // =========================

   const totalIncome =
      transactions
         .filter(
            (transaction) =>
               transaction.type === "income"
         )
         .reduce(
            (total, transaction) =>
               total +
               Number(transaction.amount),
            0
         );


   // =========================
   // TOTAL EXPENSE
   // =========================

   const totalExpense =
      transactions
         .filter(
            (transaction) =>
               transaction.type === "expense"
         )
         .reduce(
            (total, transaction) =>
               total +
               Number(transaction.amount),
            0
         );


   const balance =
      totalIncome - totalExpense;


   // =========================
   // CATEGORY BREAKDOWN
   // =========================

   const categoryBreakdown = {};


   transactions.forEach(
      (transaction) => {

         if (
            transaction.type === "expense"
         ) {

            if (
               !categoryBreakdown[
                  transaction.category
               ]
            ) {

               categoryBreakdown[
                  transaction.category
               ] = 0;

            }


            categoryBreakdown[
               transaction.category
            ] +=
               Number(transaction.amount);

         }

      }
   );


   // =========================
   // RETURN CONTEXT
   // =========================

   return {

      period: dateRange,

      summary: {

         totalIncome,

         totalExpense,

         balance,

         totalTransactions:
            transactions.length

      },

      categoryBreakdown,

      transactions

   };

};


module.exports = {
   getFinancialContext
};