import {
    useState,
    useRef,
    useEffect
} from "react";

import API from "../api/axios";
import Navbar from "../components/Navbar";
import ReactMarkdown from "react-markdown";

import {
    FaPaperPlane,
    FaRobot,
    FaUser,
    FaPlus,
    FaTrash
} from "react-icons/fa";

import "./AIAssistant.css";


// ==========================================
// DEFAULT WELCOME MESSAGE
// ==========================================

const welcomeMessage = {

    id: "welcome-message",

    role: "assistant",

    content:
        "Hi! I'm your AI Financial Assistant. Ask me anything about your income, expenses, spending patterns, or savings."

};


// ==========================================
// SUGGESTED QUESTIONS
// ==========================================

const suggestedQuestions = [

    "Where did I spend the most this month?",

    "Summarize my finances this month",

    "Compare my income and expenses",

    "How can I improve my savings?"

];


function AIAssistant() {


    // ==========================================
    // STATE
    // ==========================================

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


    // ==========================================
    // RENDER
    // ==========================================

    return (

        <div className="ai-page">


            <Navbar />


            {/* ==================================
                MAIN AI LAYOUT
            ================================== */}

            <div className="ai-layout">


                {/* ==============================
                    SIDEBAR
                ============================== */}

                <aside className="ai-sidebar">


                    {/* SIDEBAR HEADER */}

                    <div className="sidebar-header">


                        <div>

                            <h2>

                                AI Chats

                            </h2>


                            <p>

                                Your financial conversations

                            </p>

                        </div>


                    </div>


                    {/* NEW CHAT BUTTON */}

                    <button

                        className="new-chat-button"

                        onClick={
                            handleNewChat
                        }

                        disabled={
                            loading
                        }

                    >

                        <FaPlus />

                        <span>

                            New Chat

                        </span>

                    </button>


                    {/* CONVERSATION LIST */}

                    <div className="conversation-list">


                        {
                            conversationsLoading
                                ? (

                                    <p className="sidebar-status">

                                        Loading chats...

                                    </p>

                                )

                                :

                                conversations.length === 0
                                    ? (

                                        <p className="sidebar-status">

                                            No previous chats

                                        </p>

                                    )

                                    : (

                                        conversations.map(
                                            (conversation) => (

                                                <div

                                                    key={
                                                        conversation.id
                                                    }

                                                    className={
                                                        `conversation-item ${
                                                            activeConversationId
                                                            ===
                                                            conversation.id

                                                                ?
                                                                "active"

                                                                :
                                                                ""
                                                        }`
                                                    }

                                                    onClick={() =>

                                                        handleOpenConversation(

                                                            conversation.id

                                                        )

                                                    }

                                                >


                                                    <div
                                                        className=
                                                            "conversation-info"
                                                    >


                                                        <span
                                                            className=
                                                                "conversation-title"
                                                        >

                                                            {
                                                                conversation.title
                                                            }

                                                        </span>


                                                    </div>


                                                    <button

                                                        className=
                                                            "delete-chat-button"

                                                        onClick={
                                                            (event) =>

                                                                handleDeleteConversation(

                                                                    conversation.id,

                                                                    event

                                                                )
                                                        }

                                                        title=
                                                            "Delete conversation"

                                                    >

                                                        <FaTrash />

                                                    </button>


                                                </div>

                                            )
                                        )

                                    )
                        }


                    </div>


                </aside>


                {/* ==============================
                    MAIN CHAT AREA
                ============================== */}

                <main className="ai-main">


                    <div className="ai-container">


                        {/* ======================
                            HEADER
                        ====================== */}

                        <div className="ai-header">


                            <div className="ai-header-icon">

                                <FaRobot />

                            </div>


                            <div>

                                <h1>

                                    AI Financial Assistant

                                </h1>


                                <p>

                                    Ask questions about your
                                    income, expenses and
                                    spending patterns.

                                </p>

                            </div>


                        </div>


                        {/* ======================
                            SUGGESTED QUESTIONS
                        ====================== */}

                        <div className="suggested-questions">


                            {
                                suggestedQuestions.map(
                                    (
                                        question,
                                        index
                                    ) => (

                                        <button

                                            key={
                                                index
                                            }

                                            onClick={() =>

                                                handleSendMessage(

                                                    question

                                                )

                                            }

                                            disabled={
                                                loading
                                                ||
                                                messagesLoading
                                            }

                                        >

                                            {
                                                question
                                            }

                                        </button>

                                    )
                                )
                            }


                        </div>


                        {/* ======================
                            CHAT CONTAINER
                        ====================== */}

                        <div className="chat-container">


                            {/* MESSAGES */}

                            <div className="messages-container">


                                {
                                    messagesLoading
                                        ? (

                                            <div
                                                className=
                                                    "conversation-loading"
                                            >

                                                <FaRobot />

                                                <p>

                                                    Loading conversation...

                                                </p>

                                            </div>

                                        )

                                        :

                                        messages.map(
                                            (message) => (

                                                <div

                                                    key={
                                                        message.id
                                                    }

                                                    className={
                                                        `message-row ${message.role}`
                                                    }

                                                >


                                                    {/* AVATAR */}

                                                    <div
                                                        className=
                                                            "message-avatar"
                                                    >

                                                        {
                                                            message.role
                                                            ===
                                                            "assistant"

                                                                ? (
                                                                    <FaRobot />
                                                                )

                                                                : (
                                                                    <FaUser />
                                                                )
                                                        }

                                                    </div>


                                                    {/* MESSAGE BUBBLE */}

                                                    <div

                                                        className={
                                                            `message-bubble ${message.role}-bubble`
                                                        }

                                                    >

                                                        <ReactMarkdown>

                                                            {
                                                                message.content
                                                            }

                                                        </ReactMarkdown>

                                                    </div>


                                                </div>

                                            )
                                        )
                                }


                                {/* AI TYPING */}

                                {
                                    loading && (

                                        <div
                                            className=
                                                "message-row assistant"
                                        >


                                            <div
                                                className=
                                                    "message-avatar"
                                            >

                                                <FaRobot />

                                            </div>


                                            <div
                                                className=
                                                    "typing-indicator"
                                            >

                                                <span></span>

                                                <span></span>

                                                <span></span>

                                            </div>


                                        </div>

                                    )
                                }


                                {/* AUTO SCROLL */}

                                <div

                                    ref={
                                        messagesEndRef
                                    }

                                />


                            </div>


                            {/* ==================
                                INPUT
                            ================== */}

                            <div className="chat-input-container">


                                <textarea

                                    value={
                                        input
                                    }

                                    onChange={
                                        (e) =>

                                            setInput(

                                                e.target.value

                                            )
                                    }

                                    onKeyDown={
                                        handleKeyDown
                                    }

                                    placeholder=
                                        "Ask about your finances..."

                                    rows="1"

                                    disabled={
                                        loading
                                        ||
                                        messagesLoading
                                    }

                                />


                                <button

                                    className=
                                        "send-button"

                                    onClick={() =>

                                        handleSendMessage()

                                    }

                                    disabled={
                                        loading
                                        ||
                                        messagesLoading
                                        ||
                                        !input.trim()
                                    }

                                >

                                    <FaPaperPlane />

                                </button>


                            </div>


                        </div>


                        {/* ======================
                            DISCLAIMER
                        ====================== */}

                        <p className="ai-disclaimer">

                            AI-generated financial insights
                            are for informational purposes only.

                        </p>


                    </div>


                </main>


            </div>


        </div>

    );

}


export default AIAssistant;