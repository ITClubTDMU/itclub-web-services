import express from "express";
import userRoutes from "./userRoutes";

const router = express.Router();

router.get("/status", (req, res) => {
  res.status(200).json({ message: "OK LET GO" });
});

router.get("/user", userRoutes);

const APIs_V1 = router;

export default APIs_V1;
