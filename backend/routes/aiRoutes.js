const express = require("express");

const router = express.Router();

const authMiddleware = require(
    "../middleware/authMiddleware"
);


// AI CHAT CONTROLLER

const {
    chatWithAI
} = require(
    "../controllers/aiController"
);


// AI CONVERSATION CONTROLLER

const {
    createConversation,
    getConversations,
    getConversationMessages,
    deleteConversation
} = require(
    "../controllers/aiConversationController"
);


/**
 * @swagger
 * /ai/conversations:
 *   post:
 *     summary: Create a new AI conversation
 *     tags: [AI Assistant]
 */

router.post(
    "/conversations",
    authMiddleware,
    createConversation
);


/**
 * @swagger
 * /ai/conversations:
 *   get:
 *     summary: Get all AI conversations
 *     tags: [AI Assistant]
 */

router.get(
    "/conversations",
    authMiddleware,
    getConversations
);


/**
 * @swagger
 * /ai/conversations/{conversationId}/messages:
 *   get:
 *     summary: Get messages of a conversation
 *     tags: [AI Assistant]
 */

router.get(
    "/conversations/:conversationId/messages",
    authMiddleware,
    getConversationMessages
);


/**
 * @swagger
 * /ai/conversations/{conversationId}:
 *   delete:
 *     summary: Delete an AI conversation
 *     tags: [AI Assistant]
 */

router.delete(
    "/conversations/:conversationId",
    authMiddleware,
    deleteConversation
);


/**
 * @swagger
 * /ai/chat:
 *   post:
 *     summary: Chat with AI Financial Assistant
 *     tags: [AI Assistant]
 *     responses:
 *       200:
 *         description: AI response generated successfully
 */

router.post(
    "/chat",
    authMiddleware,
    chatWithAI
);


module.exports = router;