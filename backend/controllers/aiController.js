const pool = require("../config/db");


const {
   getFinancialContext
} = require(
   "../services/financialContextService"
);


const {
   generateFinancialAnswer
} = require(
   "../services/geminiService"
);


const {
   getDateRangeFromMessage
} = require(
   "../services/dateRangeService"
);


const chatWithAI = async (req, res) => {

   try {

      const userId =
         req.user.id;


      const {
         message,
         conversationId
      } = req.body;


      // =========================
      // VALIDATE QUESTION
      // =========================

      if (
         !message ||
         !message.trim()
      ) {

         return res.status(400).json({

            success: false,

            message:
               "Question is required"

         });

      }


      let activeConversationId =
         conversationId;


      // =========================
      // CREATE NEW CONVERSATION
      // IF conversationId IS NOT SENT
      // =========================

      if (!activeConversationId) {

         // First message becomes
         // conversation title

         const cleanMessage =
            message.trim();


         const conversationTitle =
            cleanMessage.length > 50

               ? cleanMessage.substring(
                    0,
                    50
                 ) + "..."

               : cleanMessage;


         const newConversation =
            await pool.query(

               `INSERT INTO ai_conversations
               (
                  user_id,
                  title
               )
               VALUES ($1, $2)
               RETURNING id`,

               [
                  userId,
                  conversationTitle
               ]

            );


         activeConversationId =
            newConversation.rows[0].id;


         console.log(
            "New Conversation Created:",
            activeConversationId
         );

      }


      // =========================
      // VERIFY EXISTING
      // CONVERSATION OWNERSHIP
      // =========================

      else {

         const existingConversation =
            await pool.query(

               `SELECT id
                FROM ai_conversations
                WHERE id = $1
                AND user_id = $2`,

               [
                  activeConversationId,
                  userId
               ]

            );


         if (
            existingConversation.rows.length === 0
         ) {

            return res.status(404).json({

               success: false,

               message:
                  "Conversation not found"

            });

         }

      }


      // =========================
      // SAVE USER MESSAGE
      // =========================

      const savedUserMessage =
         await pool.query(

            `INSERT INTO ai_chat_messages
            (
               conversation_id,
               user_id,
               role,
               content
            )
            VALUES ($1, $2, $3, $4)
            RETURNING
               id,
               conversation_id,
               role,
               content,
               created_at`,

            [
               activeConversationId,
               userId,
               "user",
               message.trim()
            ]

         );


      // =========================
      // DETECT REQUESTED PERIOD
      // =========================

      const dateRange =
         getDateRangeFromMessage(
            message
         );


      console.log(
         "Detected Date Range:",
         dateRange
      );


      // =========================
      // GET FINANCIAL DATA
      // =========================

      const financialContext =
         await getFinancialContext(

            userId,

            dateRange

         );


      // =========================
      // GENERATE GEMINI RESPONSE
      // =========================

      const answer =
         await generateFinancialAnswer(

            message,

            financialContext

         );


      // =========================
      // SAVE ASSISTANT MESSAGE
      // =========================

      const savedAssistantMessage =
         await pool.query(

            `INSERT INTO ai_chat_messages
            (
               conversation_id,
               user_id,
               role,
               content
            )
            VALUES ($1, $2, $3, $4)
            RETURNING
               id,
               conversation_id,
               role,
               content,
               created_at`,

            [
               activeConversationId,
               userId,
               "assistant",
               answer
            ]

         );


      // =========================
      // UPDATE CONVERSATION TIME
      // =========================

      await pool.query(

         `UPDATE ai_conversations
          SET updated_at =
             CURRENT_TIMESTAMP
          WHERE id = $1
          AND user_id = $2`,

         [
            activeConversationId,
            userId
         ]

      );


      // =========================
      // SEND RESPONSE
      // =========================

      return res.status(200).json({

         success: true,

         conversationId:
            activeConversationId,

         question:
            message,

         period:
            financialContext.period,

         answer,

         userMessage:
            savedUserMessage.rows[0],

         assistantMessage:
            savedAssistantMessage.rows[0]

      });


   } catch (error) {

      console.log(
         "AI Controller Error:",
         error
      );


      return res.status(500).json({

         success: false,

         message:
            "Failed to process AI request"

      });

   }

};


module.exports = {
   chatWithAI
};