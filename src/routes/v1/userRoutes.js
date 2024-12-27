import express from "express";
import { userController } from "~/controllers/userController";
import { verifyJWT } from "~/middlewares/verifyJWT";

const router = express.Router();

router
  .route("/")
  .get(userController.findAll)
  .post(verifyJWT, userController.createNew);
router
  .route("/:id")
  .get(userController.findOne)
  .put(verifyJWT, userController.updateOne);

const userRoutes = router;
export default userRoutes;
