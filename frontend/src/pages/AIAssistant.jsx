// 

import React from "react";

import Navbar from "../components/Navbar";

import useAIAssistant from "../hooks/useAIAssistant";

import Sidebar from "../components/ai/Sidebar";
import ChatHeader from "../components/ai/ChatHeader";
import StatsCards from "../components/ai/StatsCards";
import SuggestedQuestions from "../components/ai/SuggestedQuestions";
import ChatMessages from "../components/ai/ChatMessages";
import ChatInput from "../components/ai/ChatInput";
import AIInsights from "../components/ai/AIInsights";
import "../styles/aiAssistant.css";
import "../styles/sidebar.css";
import "../styles/chat.css";
import "../styles/insights.css";
import "../styles/responsive.css";

import "../styles/aiAssistant.css";

function AIAssistant() {

    const ai = useAIAssistant();

    return (

        <div className="ai-page">

            <Navbar />

            <div className="ai-dashboard">

                {/* ======================
                        LEFT SIDEBAR
                ======================= */}

                <Sidebar
                    conversations={ai.conversations}
                    conversationsLoading={ai.conversationsLoading}
                    activeConversationId={ai.activeConversationId}
                    loading={ai.loading}
                    handleNewChat={ai.handleNewChat}
                    handleOpenConversation={ai.handleOpenConversation}
                    handleDeleteConversation={ai.handleDeleteConversation}
                />

                {/* ======================
                        CENTER
                ======================= */}

                <main className="ai-main">

                    <ChatHeader />

                    <StatsCards
                        analytics={ai.analytics}
                        analyticsLoading={ai.analyticsLoading}
                    />

                    <SuggestedQuestions
                        suggestedQuestions={ai.suggestedQuestions}
                        loading={ai.loading}
                        messagesLoading={ai.messagesLoading}
                        handleSendMessage={ai.handleSendMessage}
                    />

                    <ChatMessages
                        messages={ai.messages}
                        loading={ai.loading}
                        messagesLoading={ai.messagesLoading}
                        messagesEndRef={ai.messagesEndRef}
                    />

                    <ChatInput
                        input={ai.input}
                        setInput={ai.setInput}
                        loading={ai.loading}
                        messagesLoading={ai.messagesLoading}
                        handleKeyDown={ai.handleKeyDown}
                        handleSendMessage={ai.handleSendMessage}
                    />

                </main>

                {/* ======================
                        RIGHT PANEL
                ======================= */}

                <AIInsights
                    analytics={ai.analytics}
                    analyticsLoading={ai.analyticsLoading}
                />

            </div>

        </div>

    );

}

export default AIAssistant;