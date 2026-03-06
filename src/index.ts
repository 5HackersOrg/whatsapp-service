import dotenv from "dotenv";
dotenv.config();
import http from "http";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import whatsappRoutes from "./routes/whatsappRoute.js";
// import paymentRoutes from "./routes/payments/paymentRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import recruiterRoutes from "./routes/recruiter/recruiterRoutes.js";
import ViewRoute from "./routes/viewRoute.js";
import authRoutes from "./routes/auth/authRoutes.js";
import onboardingRoute from "./routes/onboardingRoutes.js";
import placesAutoCompleteRoute from "./routes/autoCompleteRoute.js";
import { DBConnection } from "./sequelize/setup.js";
const dbInstance = new DBConnection();
const db = dbInstance.getDb();
import { createTables } from "./sequelize/models/createTables.js";

try {
  await db.authenticate();
  console.log("Database connection established successfully.");
  // await createTables();
  console.log("Tables created successfully!");
} catch (error) {
  console.error("Database connection error:", error);
  process.exit(1);
}
const app = express();
app.use(cookieParser());
app.set("trust proxy", 1);
app.set("view engine", "ejs");
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));
app.use("/user", ViewRoute);
app.use(
  "/api",
  whatsappRoutes,
  // paymentRoutes,
  testRoutes,
  placesAutoCompleteRoute,
  onboardingRoute,
  authRoutes,
  recruiterRoutes,
);

const PORT = process.env.PORT || 7000;
const server = http.createServer(app);

server.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
