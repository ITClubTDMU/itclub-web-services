import express from "express";
import { newsController } from "~/controllers/newsController";
import { verifyJWT } from "~/middlewares/verifyJWT";
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(), // Use memory storage to temporarily hold files in memory
});

const router = express.Router();

const uploadFields = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "images" },
]);

router
  .route("/")
  .get(newsController.findAll)
  .post(verifyJWT, uploadFields, newsController.createNew);
router
  .route("/:id")
  .get(newsController.findOne)
  .put(verifyJWT, uploadFields, newsController.updateOne)
  .delete(verifyJWT, newsController.deleteOne);

const newsRoutes = router;
export default newsRoutes;
