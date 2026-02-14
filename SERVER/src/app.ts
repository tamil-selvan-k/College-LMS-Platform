import express from "express";
import adminRouter from "./routes/admin";
import clientRouter from "./routes/client";

const app = express.Router();



app.use("/admin", adminRouter);
app.use("/client", clientRouter);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

export default app;