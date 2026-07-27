import React from "react";

function SuggestedQuestions({
    suggestedQuestions,
    loading,
    messagesLoading,
    handleSendMessage,
}) {
    return (
        <div className="suggested-questions">

            <h3 className="suggested-title">
                Quick Actions
            </h3>

            <div className="suggested-grid">

                {suggestedQuestions.map((question, index) => (
                    <button
                        key={index}
                        className="suggestion-card"
                        onClick={() => handleSendMessage(question)}
                        disabled={loading || messagesLoading}
                    >
                        <span>{question}</span>
                    </button>
                ))}

            </div>

        </div>
    );
}

export default SuggestedQuestions;