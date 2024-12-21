import express from "express";
import { categoryController } from "~/controllers/categoryController";

const router = express.Router();

router
  .route("/")
  .get(categoryController.findAll)
  .post(categoryController.createNew);
router
  .route("/:id")
  .get(categoryController.findOne)
  .put(categoryController.updateOne)
  .delete(categoryController.deleteOne);

const categoryRoutes = router;
export default categoryRoutes;
