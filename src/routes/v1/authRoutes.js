import express from "express";
import { authController } from "~/controllers/authController";

const router = express.Router();

router
  .route("/")
  .post(authController.handleLogin)
  .get(authController.handleLogout);

const authRoutes = router;
export default authRoutes;
