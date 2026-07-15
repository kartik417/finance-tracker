const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
   apiKey: process.env.GEMINI_API_KEY
});


const generateFinancialAnswer = async (
   message,
   financialContext
) => {

   const prompt = `
You are an AI Financial Assistant inside a personal finance tracking application.

Your job is to answer the user's question using ONLY the financial data provided below.

Rules:
- Do not invent transactions, amounts, income, or expenses.
- Use Indian Rupees (₹) when mentioning money.
- Keep the answer clear and concise.
- If there is no relevant financial data, clearly say so.
- Do not claim to be a certified financial advisor.
- Give practical suggestions only when appropriate.

USER QUESTION:
${message}

FINANCIAL DATA:
${JSON.stringify(financialContext, null, 2)}
`;


   const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: prompt
   });


   return response.text;

};


module.exports = {
   generateFinancialAnswer
};