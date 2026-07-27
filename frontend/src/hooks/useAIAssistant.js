import { useState, useEffect, useRef } from "react";
import API from "../api/axios";
// ==========================================
// STATE
// ==========================================
function useAIAssistant() {
    const welcomeMessage = {
        id: "welcome",
        role: "assistant",
        content:
            "👋 Hello! I'm your AI Financial Assistant.\n\nI can help you analyze your expenses, income, savings, budgets, and answer finance-related questions. How can I help you today?"
    };
    const suggestedQuestions = [
        "💰 How much did I spend this month?",
        "📈 Show my income vs expenses",
        "💳 Where can I save more money?",
        "🎯 Give me a budget summary"
    ];
    const [messages, setMessages] =
        useState([
            welcomeMessage
        ]);


    const [input, setInput] =
        useState("");


    const [loading, setLoading] =
        useState(false);


    // All user's conversations

    const [
        conversations,
        setConversations
    ] = useState([]);


    // Current selected conversation

    const [
        activeConversationId,
        setActiveConversationId
    ] = useState(null);


    // Loading conversation list

    const [
        conversationsLoading,
        setConversationsLoading
    ] = useState(true);


    // Loading old conversation messages

    const [
        messagesLoading,
        setMessagesLoading
    ] = useState(false);

    const [analytics, setAnalytics] = useState({
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
        totalTransactions: 0,
    });

    const [analyticsLoading, setAnalyticsLoading] = useState(true);

    const currentDate = new Date();

    const [month, setMonth] = useState(
        currentDate.getMonth() + 1
    );

    const [year, setYear] = useState(
        currentDate.getFullYear()
    );
    const messagesEndRef =
        useRef(null);


    // ==========================================
    // GET TOKEN
    // ==========================================

    const getToken = () => {

        return localStorage.getItem(
            "token"
        );

    };


    const fetchAnalytics = async () => {

        setAnalyticsLoading(true);

        try {

            const token = localStorage.getItem("token");

            const response = await API.get(
                `/analytics?month=${month}&year=${year}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setAnalytics(response.data);

        } catch (error) {

            console.log("Analytics Error:", error);

        } finally {

            setAnalyticsLoading(false);

        }

    };
    // ==========================================
    // FETCH CONVERSATIONS
    // ==========================================

    const fetchConversations = async () => {

        try {

            const token =
                getToken();


            const response =
                await API.get(

                    "/ai/conversations",

                    {

                        headers: {

                            Authorization:
                                `Bearer ${token}`

                        }

                    }

                );


            setConversations(

                response.data.conversations
                || []

            );


        } catch (error) {

            console.log(

                "Fetch conversations error:",

                error

            );

        } finally {

            setConversationsLoading(false);

        }

    };


    // ==========================================
    // FETCH CONVERSATIONS ON PAGE LOAD
    // ==========================================

    useEffect(() => {

        fetchConversations();

    }, []);

    useEffect(() => {

        fetchAnalytics();

    }, [month, year]);

    // ==========================================
    // AUTO SCROLL
    // ==========================================

    useEffect(() => {

        messagesEndRef.current
            ?.scrollIntoView({

                behavior: "smooth"

            });

    }, [
        messages,
        loading
    ]);


    // ==========================================
    // NEW CHAT
    // ==========================================

    const handleNewChat = () => {

        // No conversation exists yet.
        // Backend creates it when
        // first message is sent.

        setActiveConversationId(
            null
        );


        setMessages([

            welcomeMessage

        ]);


        setInput("");

    };


    // ==========================================
    // OPEN OLD CONVERSATION
    // ==========================================

    const handleOpenConversation =
        async (conversationId) => {


            // Prevent switching chat
            // while AI is generating

            if (loading) {
                return;
            }


            try {

                setMessagesLoading(true);


                const token =
                    getToken();


                const response =
                    await API.get(

                        `/ai/conversations/${conversationId}/messages`,

                        {

                            headers: {

                                Authorization:
                                    `Bearer ${token}`

                            }

                        }

                    );


                setActiveConversationId(

                    conversationId

                );


                const oldMessages =

                    response.data.messages
                    || [];


                // If conversation has messages,
                // show them.
                // Otherwise show welcome message.

                if (
                    oldMessages.length > 0
                ) {

                    setMessages(

                        oldMessages.map(
                            (message) => ({

                                id:
                                    message.id,

                                role:
                                    message.role,

                                content:
                                    message.content

                            })
                        )

                    );

                } else {

                    setMessages([

                        welcomeMessage

                    ]);

                }


            } catch (error) {

                console.log(

                    "Open conversation error:",

                    error

                );

            } finally {

                setMessagesLoading(false);

            }

        };


    // ==========================================
    // DELETE CONVERSATION
    // ==========================================

    const handleDeleteConversation =
        async (
            conversationId,
            event
        ) => {


            // Prevent conversation opening
            // when delete button is clicked

            event.stopPropagation();


            const shouldDelete =
                window.confirm(

                    "Delete this conversation?"

                );


            if (!shouldDelete) {
                return;
            }


            try {

                const token =
                    getToken();


                await API.delete(

                    `/ai/conversations/${conversationId}`,

                    {

                        headers: {

                            Authorization:
                                `Bearer ${token}`

                        }

                    }

                );


                // Remove from sidebar immediately

                setConversations(
                    (prevConversations) =>

                        prevConversations.filter(

                            (conversation) =>

                                conversation.id
                                !==
                                conversationId

                        )

                );


                // If deleted conversation
                // was currently open

                if (
                    activeConversationId
                    ===
                    conversationId
                ) {

                    handleNewChat();

                }


            } catch (error) {

                console.log(

                    "Delete conversation error:",

                    error

                );

            }

        };


    // ==========================================
    // SEND MESSAGE
    // ==========================================

    const handleSendMessage =
        async (
            messageText = input
        ) => {


            const trimmedMessage =
                messageText.trim();


            if (
                !trimmedMessage
                ||
                loading
                ||
                messagesLoading
            ) {

                return;

            }


            // Temporary frontend message

            const userMessage = {

                id:
                    `user-${Date.now()}`,

                role:
                    "user",

                content:
                    trimmedMessage

            };


            // Show immediately

            setMessages(
                (prevMessages) => [

                    ...prevMessages,

                    userMessage

                ]
            );


            setInput("");


            setLoading(true);


            try {

                const token =
                    getToken();


                // ==================================
                // SEND MESSAGE TO BACKEND
                // ==================================

                const response =
                    await API.post(

                        "/ai/chat",

                        {

                            message:
                                trimmedMessage,

                            conversationId:
                                activeConversationId

                        },

                        {

                            headers: {

                                Authorization:
                                    `Bearer ${token}`

                            }

                        }

                    );


                const returnedConversationId =

                    response.data
                        .conversationId;


                // ==================================
                // FIRST MESSAGE CREATED NEW CHAT
                // ==================================

                if (
                    !activeConversationId
                    &&
                    returnedConversationId
                ) {

                    setActiveConversationId(

                        returnedConversationId

                    );

                }


                // ==================================
                // ADD AI MESSAGE
                // ==================================

                const aiMessage = {

                    id:
                        response.data
                            .assistantMessage
                            ?.id

                        ||

                        `assistant-${Date.now()}`,

                    role:
                        "assistant",

                    content:
                        response.data.answer

                };


                setMessages(
                    (prevMessages) => [

                        ...prevMessages,

                        aiMessage

                    ]
                );


                // ==================================
                // REFRESH SIDEBAR
                // ==================================

                // New conversation appears
                // and updated conversation
                // moves to top.

                await fetchConversations();


            } catch (error) {

                console.log(

                    "AI request error:",

                    error

                );


                const errorMessage = {

                    id:
                        `error-${Date.now()}`,

                    role:
                        "assistant",

                    content:
                        "Sorry, I couldn't process your request. Please try again."

                };


                setMessages(
                    (prevMessages) => [

                        ...prevMessages,

                        errorMessage

                    ]
                );


            } finally {

                setLoading(false);

            }

        };


    // ==========================================
    // ENTER KEY
    // ==========================================

    const handleKeyDown = (e) => {

        if (

            e.key === "Enter"

            &&

            !e.shiftKey

        ) {

            e.preventDefault();

            handleSendMessage();

        }

    };

    return {
        // State
        messages,
        input,
        loading,
        conversations,
        activeConversationId,
        conversationsLoading,
        messagesLoading,
        messagesEndRef,

        // Constants
        suggestedQuestions,

        // Setters
        setInput,

        // Actions
        handleNewChat,
        handleOpenConversation,
        handleDeleteConversation,
        handleSendMessage,
        handleKeyDown,
        analytics,
        analyticsLoading,
        month,
        setMonth,
        year,
        setYear,
    };
}

export default useAIAssistant;