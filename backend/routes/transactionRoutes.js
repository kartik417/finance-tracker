const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    addTransaction,
    getTransactions,
    updateTransaction,
    deleteTransaction,
} = require("../controllers/transactionController");

/**
 * @swagger
 * /transactions/add:
 *   post:
 *     summary: Add new transaction
 *     tags: [Transactions]
 *     responses:
 *       201:
 *         description: Transaction added successfully
 */

router.post(
    "/add",
    authMiddleware,
    addTransaction
);
/**
 * @swagger
 * /transactions/all:
 *   get:
 *     summary: Get all transactions
 *     tags: [Transactions]
 *     responses:
 *       200:
 *         description: Transactions fetched successfully
 */

router.get(
    "/all",
    authMiddleware,
    getTransactions
);
/**
 * @swagger
 * /transactions/update/{id}:
 *   put:
 *     summary: Update transaction
 *     tags: [Transactions]
 *     responses:
 *       200:
 *         description: Transaction updated successfully
 */

router.put(
    "/update/:id",
    authMiddleware,
    updateTransaction
);
/**
 * @swagger
 * /transactions/delete/{id}:
 *   delete:
 *     summary: Delete transaction
 *     tags: [Transactions]
 *     responses:
 *       200:
 *         description: Transaction deleted successfully
 */
router.delete(
    "/delete/:id",
    authMiddleware,
    deleteTransaction
);
module.exports = router;