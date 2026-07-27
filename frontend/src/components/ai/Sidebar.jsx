import React from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

function Sidebar({
    conversations,
    conversationsLoading,
    activeConversationId,
    loading,
    handleNewChat,
    handleOpenConversation,
    handleDeleteConversation,
}) {
    return (
        <aside className="ai-sidebar">
            {/* ==============================
                SIDEBAR HEADER
            ============================== */}

            <div className="sidebar-header">
                <div>
                    <h2>AI Chats</h2>
                    <p>Your financial conversations</p>
                </div>
            </div>

            {/* ==============================
                NEW CHAT BUTTON
            ============================== */}

            <button
                className="new-chat-button"
                onClick={handleNewChat}
                disabled={loading}
            >
                <FaPlus />
                <span>New Chat</span>
            </button>

            {/* ==============================
                CONVERSATION LIST
            ============================== */}

            <div className="conversation-list">
                {conversationsLoading ? (
                    <p className="sidebar-status">
                        Loading chats...
                    </p>
                ) : conversations.length === 0 ? (
                    <p className="sidebar-status">
                        No previous chats
                    </p>
                ) : (
                    conversations.map((conversation) => (
                        <div
                            key={conversation.id}
                            className={`conversation-item ${
                                activeConversationId === conversation.id
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                handleOpenConversation(conversation.id)
                            }
                        >
                            <div className="conversation-info">
                                <span className="conversation-title">
                                    {conversation.title}
                                </span>
                            </div>

                            <button
                                className="delete-chat-button"
                                onClick={(event) =>
                                    handleDeleteConversation(
                                        conversation.id,
                                        event
                                    )
                                }
                                title="Delete conversation"
                            >
                                <FaTrash />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </aside>
    );
}

export default Sidebar;