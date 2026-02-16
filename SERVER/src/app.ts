import express from "express";
import adminRouter from "./modules/admin/adminRouter";
import clientRouter from "./modules/client/clientRouter";
import authRouter from "./modules/common/auth/authRouter"

const app = express.Router();



app.use("/admin", adminRouter);
app.use("/client", clientRouter);
app.use("/auth", authRouter);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

export default app;