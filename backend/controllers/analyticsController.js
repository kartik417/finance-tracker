const pool = require("../config/db");
const redisClient = require("../config/redis");

const getAnalytics = async (req, res) => {

    try {

        const user_id = req.user.id;
        const role = req.user.role;

        // Get selected month and year from frontend
        const { month, year } = req.query;

        console.log("Selected Month:", month);
        console.log("Selected Year:", year);

        const hasDateFilter = month && year;

        // Different cache for every month
        const cacheKey =
            role === "admin"
                ? hasDateFilter
                    ? `analytics:admin:${year}:${month}`
                    : "analytics:admin"
                : hasDateFilter
                    ? `analytics:${user_id}:${year}:${month}`
                    : `analytics:${user_id}`;

        // Check Redis cache
        const cachedData = await redisClient.get(cacheKey);

        if (cachedData) {

            console.log(`Cache HIT: ${cacheKey}`);

            return res.status(200).json(
                JSON.parse(cachedData)
            );
        }

        console.log(`Cache MISS: ${cacheKey}`);

        let transactions;


        // =========================
        // ADMIN
        // =========================

        if (role === "admin") {

            if (hasDateFilter) {

                transactions = await pool.query(
                    `SELECT *
                     FROM transactions
                     WHERE EXTRACT(MONTH FROM created_at) = $1
                     AND EXTRACT(YEAR FROM created_at) = $2
                     ORDER BY created_at DESC`,
                    [month, year]
                );

            } else {

                transactions = await pool.query(
                    `SELECT *
                     FROM transactions
                     ORDER BY created_at DESC`
                );

            }

        }


        // =========================
        // NORMAL USER
        // =========================

        else {

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


        const data = transactions.rows;


        // =========================
        // TOTALS
        // =========================

        const totalIncome = data
            .filter((t) => t.type === "income")
            .reduce(
                (acc, curr) =>
                    acc + Number(curr.amount),
                0
            );

        const totalExpense = data
            .filter((t) => t.type === "expense")
            .reduce(
                (acc, curr) =>
                    acc + Number(curr.amount),
                0
            );

        const balance =
            totalIncome - totalExpense;

        const totalTransactions =
            data.length;


        // =========================
        // MONTHLY DATA
        // =========================

        const monthlyData = {};

        data.forEach((transaction) => {

            const date =
                new Date(transaction.created_at);

            const monthKey =
                `${date.getMonth() + 1}-${date.getFullYear()}`;

            if (!monthlyData[monthKey]) {

                monthlyData[monthKey] = {
                    income: 0,
                    expense: 0
                };

            }

            if (transaction.type === "income") {

                monthlyData[monthKey].income +=
                    Number(transaction.amount);

            } else {

                monthlyData[monthKey].expense +=
                    Number(transaction.amount);

            }

        });


        // =========================
        // CATEGORY DATA
        // =========================

        const categoryData = {};

        data.forEach((transaction) => {

            if (transaction.type === "expense") {

                if (!categoryData[transaction.category]) {

                    categoryData[transaction.category] = 0;

                }

                categoryData[transaction.category] +=
                    Number(transaction.amount);

            }

        });


        // Final analytics object
        const analyticsData = {

            totalIncome,
            totalExpense,
            balance,
            totalTransactions,
            monthlyData,
            categoryData

        };


        // Save month-specific data in Redis
        await redisClient.setEx(
            cacheKey,
            900,
            JSON.stringify(analyticsData)
        );


        res.status(200).json(
            analyticsData
        );


    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};


module.exports = {
    getAnalytics
};