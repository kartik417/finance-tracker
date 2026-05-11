const pool = require("../config/db");

const getAllUsers = async (req, res) => {

   try {

      const users = await pool.query(
         `SELECT id, name, email, role
          FROM users
          ORDER BY id ASC`
      );

      res.status(200).json({
         users: users.rows
      });

   } catch(error){

      console.log(error);

      res.status(500).json({
         message: "Server Error"
      });

   }
};

module.exports = {
   getAllUsers
};