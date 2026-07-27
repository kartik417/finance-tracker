import React from "react";
import { FaRobot } from "react-icons/fa";

function ChatHeader() {
    return (
        <div className="ai-header">

            <div className="ai-header-icon">
                <FaRobot />
            </div>

            <div className="ai-header-content">
                <h1>AI Financial Assistant</h1>

                <p>
                    Ask questions about your income,
                    expenses and spending patterns.
                </p>
            </div>

        </div>
    );
}

export default ChatHeader;