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

      await redisClient.del(
         `analytics:${user_id}`
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
const getTransactions = async (req, res) => {

   try {

      const user_id = req.user.id;
      const role = req.user.role;

      let transactions;

      // ADMIN => ALL DATA
      if(role === "admin"){

         transactions = await pool.query(
            `SELECT * FROM transactions
             ORDER BY id DESC`
         );

      } else {

         // USER + READ-ONLY => OWN DATA
         transactions = await pool.query(
            `SELECT * FROM transactions
             WHERE user_id = $1
             ORDER BY id DESC`,
            [user_id]
         );

      }

      res.status(200).json({
         transactions: transactions.rows
      });

   } catch(error){

      console.log(error);

      res.status(500).json({
         message: "Server Error"
      });

   }
};
const updateTransaction = async (req, res) => {

   try {

      const { id } = req.params;

      const { title, amount, type, category } = req.body;

      const user_id = req.user.id;

      const updatedTransaction = await pool.query(
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

      if (updatedTransaction.rows.length === 0) {
         return res.status(404).json({
            message: "Transaction not found"
         });
      }
      await redisClient.del(
         `analytics:${user_id}`
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

      const deletedTransaction = await pool.query(
         `DELETE FROM transactions
          WHERE id = $1
          AND user_id = $2
          RETURNING *`,
         [id, user_id]
      );

      if (deletedTransaction.rows.length === 0) {

         return res.status(404).json({
            message: "Transaction not found"
         });

      }
      await redisClient.del(
         `analytics:${user_id}`
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