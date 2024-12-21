import express from "express";
import { newsController } from "~/controllers/newsController";

const router = express.Router();

router.route("/").get(newsController.findAll).post(newsController.createNew);
router
  .route("/:id")
  .get(newsController.findOne)
  .put(newsController.updateOne)
  .delete(newsController.deleteOne);

const newsRoutes = router;
export default newsRoutes;
