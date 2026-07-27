import React from "react";
import {
    FaWallet,
    FaArrowDown,
    FaPiggyBank,
    FaLightbulb,
    FaBullseye,
    FaChartLine,
} from "react-icons/fa";

function AIInsights({

    analytics,
    analyticsLoading,

}) {

    const budgetScore =
        analytics.totalIncome > 0
            ? Math.min(
                  100,
                  Math.round(
                      (analytics.balance /
                          analytics.totalIncome) *
                          100
                  )
              )
            : 0;

    return (

        <aside className="ai-insights">

            <div className="insights-header">

                <h2>AI Insights</h2>

                <p>Financial Overview</p>

            </div>

            {

                analyticsLoading ?

                    (

                        <div className="insight-loading">

                            Loading analytics...

                        </div>

                    )

                    :

                    (

                        <>

                            {/* Budget Score */}

                            <div className="insight-card">

                                <div className="card-header">

                                    <FaBullseye />

                                    <span>Budget Score</span>

                                </div>

                                <h2>{budgetScore}%</h2>

                                <div className="progress-bar">

                                    <div
                                        className="progress-fill"
                                        style={{
                                            width: `${budgetScore}%`,
                                        }}
                                    />

                                </div>

                            </div>

                            {/* Income */}

                            <div className="insight-card">

                                <div className="stat-row">

                                    <FaWallet />

                                    <div>

                                        <span>Total Income</span>

                                        <h3>
                                            ₹ {analytics.totalIncome}
                                        </h3>

                                    </div>

                                </div>

                            </div>

                            {/* Expense */}

                            <div className="insight-card">

                                <div className="stat-row">

                                    <FaArrowDown />

                                    <div>

                                        <span>Total Expense</span>

                                        <h3>
                                            ₹ {analytics.totalExpense}
                                        </h3>

                                    </div>

                                </div>

                            </div>

                            {/* Balance */}

                            <div className="insight-card">

                                <div className="stat-row">

                                    <FaPiggyBank />

                                    <div>

                                        <span>Current Balance</span>

                                        <h3>
                                            ₹ {analytics.balance}
                                        </h3>

                                    </div>

                                </div>

                            </div>

                            {/* Transactions */}

                            <div className="insight-card">

                                <div className="stat-row">

                                    <FaChartLine />

                                    <div>

                                        <span>Transactions</span>

                                        <h3>
                                            {analytics.totalTransactions}
                                        </h3>

                                    </div>

                                </div>

                            </div>

                            {/* AI Suggestions */}

                            <div className="insight-card">

                                <div className="card-header">

                                    <FaLightbulb />

                                    <span>Suggestions</span>

                                </div>

                                <ul className="tips-list">

                                    {

                                        analytics.balance < 0 &&

                                        <li>
                                            Your expenses are greater than your income.
                                        </li>

                                    }

                                    {

                                        analytics.totalExpense >
                                            analytics.totalIncome * 0.8 &&

                                        <li>
                                            Your spending is above 80% of your income.
                                        </li>

                                    }

                                    {

                                        analytics.balance > 0 &&

                                        <li>
                                            Great! You're saving money this month.
                                        </li>

                                    }

                                    {

                                        analytics.totalTransactions > 50 &&

                                        <li>
                                            You have many transactions. Consider reviewing recurring expenses.
                                        </li>

                                    }

                                </ul>

                            </div>

                        </>

                    )

            }

        </aside>

    );

}

export default AIInsights;