import React from "react";
import { FaRobot, FaUser } from "react-icons/fa";
import ReactMarkdown from "react-markdown";

function ChatMessages({
    messages,
    loading,
    messagesLoading,
    messagesEndRef,
}) {
    return (
        <div className="messages-container">

            {/* Loading Conversation */}
            {messagesLoading ? (
                <div className="conversation-loading">
                    <FaRobot />
                    <p>Loading conversation...</p>
                </div>
            ) : (

                messages.map((message) => (

                    <div
                        key={message.id}
                        className={`message-row ${message.role}`}
                    >

                        {/* Avatar */}

                        <div className="message-avatar">

                            {message.role === "assistant"
                                ? <FaRobot />
                                : <FaUser />
                            }

                        </div>

                        {/* Bubble */}

                        <div
                            className={`message-bubble ${message.role}-bubble`}
                        >

                            <ReactMarkdown>
                                {message.content}
                            </ReactMarkdown>

                        </div>

                    </div>

                ))

            )}

            {/* AI Typing */}

            {loading && (

                <div className="message-row assistant">

                    <div className="message-avatar">
                        <FaRobot />
                    </div>

                    <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>

                </div>

            )}

            {/* Auto Scroll */}

            <div ref={messagesEndRef} />

        </div>
    );
}

export default ChatMessages;