const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const authorizeRole = require("../middleware/roleMiddleware");

const {
   getAllUsers
} = require("../controllers/userController");

/**
 * @swagger
 * /users/all:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Users fetched successfully
 */
router.get(
   "/all",
   authMiddleware,
   authorizeRole("admin"),
   getAllUsers
);

module.exports = router;