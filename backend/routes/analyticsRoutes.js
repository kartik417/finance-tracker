const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
   getAnalytics
} = require("../controllers/analyticsController");

/**
 * @swagger
 * /analytics:
 *   get:
 *     summary: Get analytics data
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Analytics fetched successfully
 */

router.get(
   "/",
   authMiddleware,
   getAnalytics
);

module.exports = router;