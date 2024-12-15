import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({ message: "LIST USER" });
});


const userRoutes = router;
export default userRoutes;