import express from "express";
import { sendEmail } from "~/controllers/sendMailController";
import { verifyJWT } from "~/middlewares/verifyJWT";

const router = express.Router();

router.route("/").post(verifyJWT, sendEmail);

const sendMailRoutes = router;
export default sendMailRoutes;
