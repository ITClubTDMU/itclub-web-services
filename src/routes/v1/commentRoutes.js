import express from "express";
import { commentController } from "~/controllers/commentController";
import { verifyJWT } from "~/middlewares/verifyJWT";

const router = express.Router();

router
  .route("/")
  .get(commentController.findAll)
  .post(verifyJWT, commentController.createNew);
router
  .route("/:id")
  .get(commentController.findOne)
  .put(verifyJWT, commentController.updateOne)
  .delete(verifyJWT, commentController.deleteOne);

const commentRoutes = router;
export default commentRoutes;
