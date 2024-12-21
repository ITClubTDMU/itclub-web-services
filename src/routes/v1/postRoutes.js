import express from "express";
import { postController } from "~/controllers/postController";

const router = express.Router();

router.route("/").get(postController.findAll).post(postController.createNew);
router
  .route("/:id")
  .get(postController.findOne)
  .put(postController.updateOne)
  .delete(postController.deleteOne);

const postRoutes = router;
export default postRoutes;
