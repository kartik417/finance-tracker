const pool = require("../config/db");
const redisClient = require("../config/redis");

const getAnalytics = async (req, res) => {

    try {
        const cacheKey =
            req.user.role === "admin"
                ? "analytics:admin"
                : `analytics:${req.user.id}`;
                
        const cachedData = await redisClient.get(cacheKey);

        if (cachedData) {

            return res.status(200).json(
                JSON.parse(cachedData)
            );

        }

        const user_id = req.user.id;
        const role = req.user.role;

        let transactions;

        // admin => all transactions
        if (role === "admin") {

            transactions = await pool.query(
                `SELECT * FROM transactions
             ORDER BY created_at DESC`
            );

        } else {

            transactions = await pool.query(
                `SELECT * FROM transactions
             WHERE user_id = $1
             ORDER BY created_at DESC`,
                [user_id]
            );

        }

        const data = transactions.rows;

        // totals
        const totalIncome = data
            .filter((t) => t.type === "income")
            .reduce((acc, curr) => acc + Number(curr.amount), 0);

        const totalExpense = data
            .filter((t) => t.type === "expense")
            .reduce((acc, curr) => acc + Number(curr.amount), 0);
        const balance = totalIncome - totalExpense;

        const totalTransactions = data.length;
        // monthly data
        const monthlyData = {};

        data.forEach((transaction) => {

            const date = new Date(transaction.created_at);

            const month =
                `${date.getMonth() + 1}-${date.getFullYear()}`;

            if (!monthlyData[month]) {

                monthlyData[month] = {
                    income: 0,
                    expense: 0
                };

            }

            if (transaction.type === "income") {

                monthlyData[month].income += Number(transaction.amount);

            } else {

                monthlyData[month].expense += Number(transaction.amount);

            }

        });

        // category breakdown
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

        await redisClient.setEx(
            cacheKey,
            900,
            JSON.stringify({
                totalIncome,
                totalExpense,
                balance: totalIncome - totalExpense,
                totalTransactions: data.length,
                monthlyData,
                categoryData
            })
        );

        res.status(200).json({
            totalIncome,
            totalExpense,
            balance,
            totalTransactions,
            monthlyData,
            categoryData
        });

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