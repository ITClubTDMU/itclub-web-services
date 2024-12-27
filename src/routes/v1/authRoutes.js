import express from "express";
import { authController } from "~/controllers/authController";

const router = express.Router();

router.route("/login").post(authController.handleLogin);
router.route("/register").post(authController.handleRegister);

const authRoutes = router;
export default authRoutes;
