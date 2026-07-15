const pool = require("../config/db");


// ==========================================
// CREATE NEW CONVERSATION
// POST /api/ai/conversations
// ==========================================

const createConversation = async (req, res) => {

   try {

      const userId = req.user.id;

      const title =
         req.body.title?.trim()
         || "New Chat";


      const result = await pool.query(

         `INSERT INTO ai_conversations
         (user_id, title)
         VALUES ($1, $2)
         RETURNING
            id,
            user_id,
            title,
            created_at,
            updated_at`,

         [
            userId,
            title
         ]

      );


      return res.status(201).json({

         success: true,

         conversation:
            result.rows[0]

      });


   } catch (error) {

      console.error(
         "Create Conversation Error:",
         error
      );


      return res.status(500).json({

         success: false,

         message:
            "Failed to create conversation"

      });

   }

};


// ==========================================
// GET ALL USER CONVERSATIONS
// GET /api/ai/conversations
// ==========================================

const getConversations = async (req, res) => {

   try {

      const userId =
         req.user.id;


      const result = await pool.query(

         `SELECT
            id,
            title,
            created_at,
            updated_at
          FROM ai_conversations
          WHERE user_id = $1
          ORDER BY updated_at DESC`,

         [
            userId
         ]

      );


      return res.status(200).json({

         success: true,

         conversations:
            result.rows

      });


   } catch (error) {

      console.error(
         "Get Conversations Error:",
         error
      );


      return res.status(500).json({

         success: false,

         message:
            "Failed to fetch conversations"

      });

   }

};


// ==========================================
// GET ONE CONVERSATION'S MESSAGES
// GET /api/ai/conversations/:conversationId/messages
// ==========================================

const getConversationMessages =
   async (req, res) => {

      try {

         const userId =
            req.user.id;

         const {
            conversationId
         } = req.params;


         // Check that this conversation
         // belongs to the logged-in user

         const conversationResult =
            await pool.query(

               `SELECT
                  id,
                  title,
                  created_at,
                  updated_at
                FROM ai_conversations
                WHERE id = $1
                AND user_id = $2`,

               [
                  conversationId,
                  userId
               ]

            );


         if (
            conversationResult.rows.length === 0
         ) {

            return res.status(404).json({

               success: false,

               message:
                  "Conversation not found"

            });

         }


         // Get all messages
         // from this conversation

         const messagesResult =
            await pool.query(

               `SELECT
                  id,
                  conversation_id,
                  role,
                  content,
                  created_at
                FROM ai_chat_messages
                WHERE conversation_id = $1
                AND user_id = $2
                ORDER BY created_at ASC, id ASC`,

               [
                  conversationId,
                  userId
               ]

            );


         return res.status(200).json({

            success: true,

            conversation:
               conversationResult.rows[0],

            messages:
               messagesResult.rows

         });


      } catch (error) {

         console.error(
            "Get Conversation Messages Error:",
            error
         );


         return res.status(500).json({

            success: false,

            message:
               "Failed to fetch conversation messages"

         });

      }

   };


// ==========================================
// DELETE CONVERSATION
// DELETE /api/ai/conversations/:conversationId
// ==========================================

const deleteConversation =
   async (req, res) => {

      try {

         const userId =
            req.user.id;

         const {
            conversationId
         } = req.params;


         const result =
            await pool.query(

               `DELETE FROM ai_conversations
                WHERE id = $1
                AND user_id = $2
                RETURNING id`,

               [
                  conversationId,
                  userId
               ]

            );


         if (
            result.rows.length === 0
         ) {

            return res.status(404).json({

               success: false,

               message:
                  "Conversation not found"

            });

         }


         // ai_chat_messages will be
         // automatically deleted because
         // conversation_id uses ON DELETE CASCADE


         return res.status(200).json({

            success: true,

            message:
               "Conversation deleted successfully",

            conversationId:
               result.rows[0].id

         });


      } catch (error) {

         console.error(
            "Delete Conversation Error:",
            error
         );


         return res.status(500).json({

            success: false,

            message:
               "Failed to delete conversation"

         });

      }

   };


module.exports = {

   createConversation,

   getConversations,

   getConversationMessages,

   deleteConversation

};