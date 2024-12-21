import express from "express";
import { refreshTokenController } from "~/controllers/refreshTokenController";

const router = express.Router();

router.route("/").get(refreshTokenController.handleRefreshToken);

const refreshTokenRoutes = router;
export default refreshTokenRoutes;
