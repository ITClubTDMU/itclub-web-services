import express from "express";
import { categoryController } from "~/controllers/categoryController";
import { verifyJWT } from "~/middlewares/verifyJWT";

const router = express.Router();

router
  .route("/")
  .get(categoryController.findAll)
  .post(verifyJWT, categoryController.createNew);
router
  .route("/:id")
  .get(categoryController.findOne)
  .put(verifyJWT, categoryController.updateOne)
  .delete(verifyJWT, categoryController.deleteOne);

const categoryRoutes = router;
export default categoryRoutes;
