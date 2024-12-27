import express from "express";
import { postController } from "~/controllers/postController";
import { verifyJWT } from "~/middlewares/verifyJWT";

const router = express.Router();

router
  .route("/")
  .get(postController.findAll)
  .post(verifyJWT, postController.createNew);
router
  .route("/:id")
  .get(postController.findOne)
  .put(verifyJWT, postController.updateOne)
  .delete(verifyJWT, postController.deleteOne);

const postRoutes = router;
export default postRoutes;
