import express from "express";
const router = express.Router();


router.use("/health", (req, res) => {
  res.json("CLIENT HEALTH OK");
})

export default router;