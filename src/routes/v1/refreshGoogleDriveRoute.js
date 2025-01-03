import express from "express";
import { refreshGoogleDriveController } from "~/controllers/refreshGoogleDriveController";
import { verifyJWT } from "~/middlewares/verifyJWT";

const router = express.Router();

router
  .route("/newses")
  .post(verifyJWT, refreshGoogleDriveController.refreshNews);

const refreshGoogleDriveRoutes = router;
export default refreshGoogleDriveRoutes;
