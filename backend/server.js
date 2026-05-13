const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const pool = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const userRoutes = require("./routes/userRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const rateLimit = require("express-rate-limit");
const redisClient = require("./config/redis");
const helmet = require("helmet");
const swaggerUi =
  require("swagger-ui-express");
const swaggerSpec =
  require("./config/swagger");
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());

const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: {
    message:
      "Too many login attempts. Please try again after 1 minute."
  }
});

const transactionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  message: "Too many transaction requests"
});

const analyticsLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 50,
  message: "Too many analytics requests"
});
app.use("/api/auth", authLimiter, authRoutes);

app.use(
  "/api/transactions",
  transactionLimiter,
  transactionRoutes
);

app.use(
  "/api/analytics",
  analyticsLimiter,
  analyticsRoutes
);


app.use("/api/users", userRoutes);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

app.get("/api/health", (req, res) => {
   res.status(200).json({
      success: true,
      message: "Server running"
   });
});

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "Database connected",
      time: result.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Database connection failed",
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});