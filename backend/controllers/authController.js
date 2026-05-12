const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
   try {

      const { name, email, password } = req.body;

      // check user already exists
      const userExists = await pool.query(
         "SELECT * FROM users WHERE email = $1",
         [email]
      );

      if (userExists.rows.length > 0) {
         return res.status(400).json({
            message: "User already exists"
         });
      }

      // hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // insert user
      const newUser = await pool.query(
         `INSERT INTO users(name, email, password)
          VALUES($1, $2, $3)
          RETURNING id, name, email, role`,
         [name, email, hashedPassword]
      );
      console.log("New User Registered:", email);
      res.status(201).json({
         message: "User registered successfully",
         user: newUser.rows[0]
      });

   } catch (error) {
      console.log(error);

      res.status(500).json({
         message: "Server Error"
      });
   }
};


const loginUser = async (req, res) => {

   try {

      const { email, password } = req.body;

      console.log(
         `Login Attempt: ${email}`
      );

      // check user exists
      const user = await pool.query(
         "SELECT * FROM users WHERE email = $1",
         [email]
      );

      // user not found
      if (user.rows.length === 0) {

         console.log(
            `Login Failed - User Not Found: ${email}`
         );

         return res.status(400).json({
            message: "Invalid credentials"
         });

      }

      // compare password
      const validPassword = await bcrypt.compare(
         password,
         user.rows[0].password
      );

      // wrong password
      if (!validPassword) {

         console.log(
            `Login Failed - Wrong Password: ${email}`
         );

         return res.status(400).json({
            message: "Invalid credentials"
         });

      }

      // generate token
      const token = jwt.sign(
         {
            id: user.rows[0].id,
            role: user.rows[0].role
         },
         process.env.JWT_SECRET,
         {
            expiresIn: "1d"
         }
      );

      console.log(
         `Login Success: ${email} (${user.rows[0].role})`
      );

      res.status(200).json({
         message: "Login successful",
         token
      });

   } catch (error) {

      console.log(
         "Login Server Error:",
         error.message
      );

      res.status(500).json({
         message: "Server Error"
      });

   }
};

module.exports = {
   registerUser,
   loginUser
};