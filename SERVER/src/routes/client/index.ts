import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Client route" });
});

export default router;
