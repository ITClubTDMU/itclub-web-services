import express from "express";
import userRoutes from "./userRoutes";
import { StatusCodes } from "~/utils/statusCodes";
import newsRoutes from "./newsRoutes";
import categoryRoutes from "./categoryRoutes";
import postRoutes from "./postRoutes";
import commentRoutes from "./commentRoutes";
import authRoutes from "./authRoutes";
import sendMailRoutes from "./sendMailRoute";

const router = express.Router();

router.get("/status", (req, res) => {
  res
    .status(StatusCodes.OK)
    .json({ message: "OK LET GO", statusCode: StatusCodes.OK });
});

router.use("/auth", authRoutes);
router.use("/news", newsRoutes);
router.use("/category", categoryRoutes);
router.use("/post", postRoutes);
router.use("/comment", commentRoutes);
router.use("/user", userRoutes);
router.use("/send-mail", sendMailRoutes);

const APIs_V1 = router;

export default APIs_V1;
