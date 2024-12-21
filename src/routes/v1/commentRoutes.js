import express from "express";
import { commentController } from "~/controllers/commentController";

const router = express.Router();

router
  .route("/")
  .get(commentController.findAll)
  .post(commentController.createNew);
router
  .route("/:id")
  .get(commentController.findOne)
  .put(commentController.updateOne)
  .delete(commentController.deleteOne);

const commentRoutes = router;
export default commentRoutes;
