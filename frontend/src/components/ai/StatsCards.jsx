import React from "react";
import {
    FaWallet,
    FaArrowDown,
    FaPiggyBank,
    FaChartLine,
} from "react-icons/fa";

function StatsCards() {

    // Dummy data for now
    const stats = [
        {
            title: "Income",
            value: "₹80,000",
            change: "+8%",
            icon: <FaWallet />,
        },
        {
            title: "Expenses",
            value: "₹48,000",
            change: "-3%",
            icon: <FaArrowDown />,
        },
        {
            title: "Savings",
            value: "₹32,000",
            change: "40%",
            icon: <FaPiggyBank />,
        },
        {
            title: "Budget Score",
            value: "92%",
            change: "Excellent",
            icon: <FaChartLine />,
        },
    ];

    return (
        <div className="stats-container">

            {stats.map((card, index) => (
                <div className="stat-card" key={index}>

                    <div className="stat-icon">
                        {card.icon}
                    </div>

                    <div className="stat-content">

                        <p className="stat-title">
                            {card.title}
                        </p>

                        <h3 className="stat-value">
                            {card.value}
                        </h3>

                        <span className="stat-change">
                            {card.change}
                        </span>

                    </div>

                </div>
            ))}

        </div>
    );
}

export default StatsCards;