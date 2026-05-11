const swaggerJsDoc = require("swagger-jsdoc");

const options = {

    definition: {

        openapi: "3.0.0",

        info: {

            title: "Finance Tracker API",

            version: "1.0.0",

            description:
                "Finance Tracker Backend API"

        },

        servers: [

            {
                url: "http://localhost:5000/api",
                description: "Local Server"
            },

            {
                url: "https://finance-tracker-uuqc.onrender.com/api",
                description: "Production Server"
            }

        ]

    },

    apis: ["./routes/*.js"]

};

const swaggerSpec =
    swaggerJsDoc(options);

module.exports = swaggerSpec;