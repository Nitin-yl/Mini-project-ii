import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import { errorHandler, routeNotFound } from "./middleware/errorMiddleware.js";
import routes from "./routes/index.js";
import dbConnection from "./utils/connectDB.js";

dotenv.config();

dbConnection();

const port = process.env.PORT || 5000;
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.CLIENT_URL_2,
  "https://mini-project-ii-topaz.vercel.app",
  "http://localhost:3000",
  "http://localhost:3001",
].filter(Boolean);
const vercelPreviewPattern = /^https:\/\/.*\.vercel\.app$/;

const app = express();

const corsOptions = {
  origin: (origin, callback) => {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      vercelPreviewPattern.test(origin)
    ) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

app.use(cookieParser());

//app.use(morgan("dev"));
app.use("/api", routes);

app.use(routeNotFound);
app.use(errorHandler);

if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => console.log(`Server listening on ${port}`));
}

export default app;
