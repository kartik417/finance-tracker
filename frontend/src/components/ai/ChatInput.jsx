import React from "react";
import { FaPaperPlane } from "react-icons/fa";

function ChatInput({
    input,
    setInput,
    loading,
    messagesLoading,
    handleKeyDown,
    handleSendMessage,
}) {
    return (
        <div className="chat-input-wrapper">

            <div className="chat-input-container">

                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything about your finances..."
                    rows={1}
                    disabled={loading || messagesLoading}
                />

                <button
                    className="send-button"
                    onClick={() => handleSendMessage()}
                    disabled={
                        loading ||
                        messagesLoading ||
                        !input.trim()
                    }
                >
                    <FaPaperPlane />
                </button>

            </div>

            <p className="input-footer">
                AI-generated financial insights are for informational purposes only.
            </p>

        </div>
    );
}

export default ChatInput;