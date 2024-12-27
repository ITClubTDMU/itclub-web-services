import express from "express";
import { newsController } from "~/controllers/newsController";
import { verifyJWT } from "~/middlewares/verifyJWT";

const router = express.Router();

router
  .route("/")
  .get(newsController.findAll)
  .post(verifyJWT, newsController.createNew);
router
  .route("/:id")
  .get(newsController.findOne)
  .put(verifyJWT, newsController.updateOne)
  .delete(verifyJWT, newsController.deleteOne);

const newsRoutes = router;
export default newsRoutes;
