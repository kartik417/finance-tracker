
const express = require("express");

const router = express.Router();

const {
   registerUser,
    loginUser
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register user
 *     tags: [Auth]
 *     responses:
 *       201:
 *         description: User registered successfully
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Login successful
 */


router.post("/register", registerUser);
router.post("/login", loginUser);
/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get logged in user profile
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User profile fetched
 */

router.get(
   "/profile",
   authMiddleware,
   (req, res) => {

      res.json({
         message: "Protected route accessed",
         user: req.user
      });

   }
);
router.get(
   "/admin",
   authMiddleware,
   roleMiddleware("admin"),
   (req, res) => {

      res.json({
         message: "Welcome Admin"
      });

   }
);
module.exports = router;