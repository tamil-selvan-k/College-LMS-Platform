import appRouter from "./src/app";
import { logger, connectDB } from "./src/config/index";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import express from "express"
import morgan from "morgan"
dotenv.config();

const app = express()
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("combined", {
  stream: {
    write: (message: string) => logger.info(message.trim())
  }
}));

const PORT = process.env.PORT || 3000;

app.use("/api", appRouter)

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
    connectDB();
  } catch (error) {
    logger.error("Error creating server", error);
    process.exit(1);
  }
};

startServer();