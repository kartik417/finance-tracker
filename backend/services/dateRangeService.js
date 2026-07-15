const getDateRangeFromMessage = (message) => {

   const question = message.toLowerCase();

   const now = new Date();

   const currentMonth = now.getMonth() + 1;
   const currentYear = now.getFullYear();


   // =========================
   // LAST MONTH
   // =========================

   if (question.includes("last month")) {

      let month = currentMonth - 1;
      let year = currentYear;

      if (month === 0) {
         month = 12;
         year = currentYear - 1;
      }

      return {
         type: "month",
         month,
         year,
         label: "Last Month"
      };

   }


   // =========================
   // FINANCIAL YEAR
   // Examples:
   // FY 26-27
   // FY 2026-27
   // FY 2026-2027
   // =========================

   const fyMatch = question.match(
      /(?:fy|financial year)\s*(\d{2,4})\s*[-/]\s*(\d{2,4})/i
   );

   if (fyMatch) {

      let startYear =
         Number(fyMatch[1]);

      let endYear =
         Number(fyMatch[2]);


      // Convert 26 → 2026

      if (startYear < 100) {
         startYear += 2000;
      }


      // Convert 27 → 2027

      if (endYear < 100) {
         endYear += 2000;
      }


      return {

         type: "range",

         startDate:
            `${startYear}-04-01`,

         endDate:
            `${endYear}-03-31`,

         label:
            `FY ${startYear}-${endYear}`

      };

   }


   // =========================
   // SPECIFIC MONTH + YEAR
   // Example: May 2026
   // =========================

   const months = {

      january: 1,
      february: 2,
      march: 3,
      april: 4,
      may: 5,
      june: 6,
      july: 7,
      august: 8,
      september: 9,
      october: 10,
      november: 11,
      december: 12

   };


   for (
      const [monthName, monthNumber]
      of Object.entries(months)
   ) {

      const monthRegex =
         new RegExp(
            `${monthName}\\s+(\\d{4})`,
            "i"
         );


      const match =
         question.match(monthRegex);


      if (match) {

         return {

            type: "month",

            month: monthNumber,

            year: Number(match[1]),

            label:
               `${monthName} ${match[1]}`

         };

      }

   }


   // =========================
   // THIS YEAR
   // =========================

   if (
      question.includes("this year")
      || question.includes("current year")
   ) {

      return {

         type: "year",

         year: currentYear,

         label:
            `${currentYear}`

      };

   }


   // =========================
   // DEFAULT = CURRENT MONTH
   // =========================

   return {

      type: "month",

      month: currentMonth,

      year: currentYear,

      label: "Current Month"

   };

};


module.exports = {
   getDateRangeFromMessage
};