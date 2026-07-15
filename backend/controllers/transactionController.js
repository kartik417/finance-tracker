const pool = require("../config/db");
const redisClient = require("../config/redis");

const addTransaction = async (req, res) => {

   try {

      const { title, amount, type, category } = req.body;

      const user_id = req.user.id;

      const newTransaction = await pool.query(
         `INSERT INTO transactions
         (title, amount, type, category, user_id)
         VALUES($1, $2, $3, $4, $5)
         RETURNING *`,
         [title, amount, type, category, user_id]
      );

      // await redisClient.del(
      //    `analytics:${user_id}`
      // );

      // await redisClient.del(
      //    "analytics:admin"
      // );

      const addedTransaction =
         newTransaction.rows[0];

      const transactionDate =
         new Date(
            addedTransaction.created_at
         );

      const transactionMonth =
         transactionDate.getMonth() + 1;

      const transactionYear =
         transactionDate.getFullYear();


      // Delete user's month-specific cache

      await redisClient.del(
         `analytics:${user_id}:${transactionYear}:${transactionMonth}`
      );


      // Delete admin's month-specific cache

      await redisClient.del(
         `analytics:admin:${transactionYear}:${transactionMonth}`
      );


      // Also delete all-time caches

      await redisClient.del(
         `analytics:${user_id}`
      );

      await redisClient.del(
         "analytics:admin"
      );


      const userCacheKey =
         `analytics:${user_id}:${transactionYear}:${transactionMonth}`;

      console.log(
         "Deleting Redis cache:",
         userCacheKey
      );

      const deletedCount =
         await redisClient.del(
            userCacheKey
         );

      console.log(
         "Redis keys deleted:",
         deletedCount
      );
      res.status(201).json({
         message: "Transaction added",
         transaction: newTransaction.rows[0]
      });

   } catch (error) {

      console.log(error);

      res.status(500).json({
         message: "Server Error"
      });

   }
};

// const getTransactions = async (req, res) => {

//    try {

//       const user_id = req.user.id;
//       const role = req.user.role;

//       let transactions;


//       // ADMIN => ALL DATA
//       if (role === "admin") {

//          transactions = await pool.query(
//             `SELECT
//          transactions.*,
//          users.name,
//          users.email
//        FROM transactions
//        JOIN users
//        ON transactions.user_id = users.id
//        ORDER BY transactions.id DESC`
//          );

//       } else {

//          // USER + READ-ONLY => OWN DATA
//          transactions = await pool.query(
//             `SELECT * FROM transactions
//        WHERE user_id = $1
//        ORDER BY id DESC`,
//             [user_id]
//          );

//       }

//       res.status(200).json({
//          transactions: transactions.rows
//       });

//    } catch (error) {

//       console.log(error);

//       res.status(500).json({
//          message: "Server Error"
//       });

//    }
// };

const getTransactions = async (req, res) => {
   try {
      const user_id = req.user.id;
      const role = req.user.role;

      // Example:
      // /api/transactions?month=6&year=2026
      const { month, year } = req.query;

      let transactions;

      // If month and year are provided
      const hasDateFilter = month && year;

      if (role === "admin") {

         // ADMIN => ALL DATA
         if (hasDateFilter) {
            transactions = await pool.query(
               `SELECT
                  transactions.*,
                  users.name,
                  users.email
                FROM transactions
                JOIN users
                  ON transactions.user_id = users.id
                WHERE EXTRACT(MONTH FROM transactions.created_at) = $1
                  AND EXTRACT(YEAR FROM transactions.created_at) = $2
                ORDER BY transactions.created_at DESC`,
               [month, year]
            );
         } else {
            transactions = await pool.query(
               `SELECT
                  transactions.*,
                  users.name,
                  users.email
                FROM transactions
                JOIN users
                  ON transactions.user_id = users.id
                ORDER BY transactions.created_at DESC`
            );
         }

      } else {

         // USER + READ-ONLY => OWN DATA
         if (hasDateFilter) {
            transactions = await pool.query(
               `SELECT *
                FROM transactions
                WHERE user_id = $1
                  AND EXTRACT(MONTH FROM created_at) = $2
                  AND EXTRACT(YEAR FROM created_at) = $3
                ORDER BY created_at DESC`,
               [user_id, month, year]
            );
         } else {
            transactions = await pool.query(
               `SELECT *
                FROM transactions
                WHERE user_id = $1
                ORDER BY created_at DESC`,
               [user_id]
            );
         }
      }

      res.status(200).json({
         transactions: transactions.rows
      });

   } catch (error) {
      console.log(error);

      res.status(500).json({
         message: "Server Error"
      });
   }
};

const updateTransaction = async (req, res) => {

   try {

      const { id } = req.params;

      const {
         title,
         amount,
         type,
         category
      } = req.body;

      const user_id = req.user.id;
      const role = req.user.role;

      let updatedTransaction;

      // ADMIN => UPDATE ANY
      if (role === "admin") {

         updatedTransaction = await pool.query(
            `UPDATE transactions
             SET title = $1,
                 amount = $2,
                 type = $3,
                 category = $4
             WHERE id = $5
             RETURNING *`,
            [title, amount, type, category, id]
         );

      } else {

         // USER => ONLY OWN
         updatedTransaction = await pool.query(
            `UPDATE transactions
             SET title = $1,
                 amount = $2,
                 type = $3,
                 category = $4
             WHERE id = $5
             AND user_id = $6
             RETURNING *`,
            [title, amount, type, category, id, user_id]
         );

      }

      if (updatedTransaction.rows.length === 0) {

         return res.status(404).json({
            message: "Transaction not found"
         });

      }


      // const affectedUserId =
      //    updatedTransaction.rows[0].user_id;

      // await redisClient.del(
      //    `analytics:${affectedUserId}`
      // );

      // await redisClient.del(
      //    `analytics:admin`
      // );

      const transaction =
         updatedTransaction.rows[0];


      const affectedUserId =
         transaction.user_id;


      const transactionDate =
         new Date(
            transaction.created_at
         );


      const transactionMonth =
         transactionDate.getMonth() + 1;


      const transactionYear =
         transactionDate.getFullYear();


      await redisClient.del(
         `analytics:${affectedUserId}:${transactionYear}:${transactionMonth}`
      );


      await redisClient.del(
         `analytics:admin:${transactionYear}:${transactionMonth}`
      );


      await redisClient.del(
         `analytics:${affectedUserId}`
      );


      await redisClient.del(
         "analytics:admin"
      );

      res.status(200).json({
         message: "Transaction updated",
         transaction: updatedTransaction.rows[0]
      });

   } catch (error) {

      console.log(error);

      res.status(500).json({
         message: "Server Error"
      });

   }
};




const deleteTransaction = async (req, res) => {

   try {

      const { id } = req.params;

      const user_id = req.user.id;
      const role = req.user.role;

      let deletedTransaction;

      // ADMIN => DELETE ANY
      if (role === "admin") {

         deletedTransaction = await pool.query(
            `DELETE FROM transactions
             WHERE id = $1
             RETURNING *`,
            [id]
         );

      } else {

         // USER => OWN ONLY
         deletedTransaction = await pool.query(
            `DELETE FROM transactions
             WHERE id = $1
             AND user_id = $2
             RETURNING *`,
            [id, user_id]
         );

      }

      if (deletedTransaction.rows.length === 0) {

         return res.status(404).json({
            message: "Transaction not found"
         });

      }

      // const affectedUserId =
      //    deletedTransaction.rows[0].user_id;

      // await redisClient.del(
      //    `analytics:${affectedUserId}`
      // );

      // await redisClient.del(
      //    `analytics:admin`
      // );

      const transaction =
         deletedTransaction.rows[0];


      const affectedUserId =
         transaction.user_id;


      const transactionDate =
         new Date(
            transaction.created_at
         );


      const transactionMonth =
         transactionDate.getMonth() + 1;


      const transactionYear =
         transactionDate.getFullYear();


      await redisClient.del(
         `analytics:${affectedUserId}:${transactionYear}:${transactionMonth}`
      );


      await redisClient.del(
         `analytics:admin:${transactionYear}:${transactionMonth}`
      );


      await redisClient.del(
         `analytics:${affectedUserId}`
      );


      await redisClient.del(
         "analytics:admin"
      );

      res.status(200).json({
         message: "Transaction deleted",
         transaction: deletedTransaction.rows[0]
      });

   } catch (error) {

      console.log(error);

      res.status(500).json({
         message: "Server Error"
      });

   }
};


module.exports = {
   addTransaction,
   getTransactions,
   updateTransaction,
   deleteTransaction

};