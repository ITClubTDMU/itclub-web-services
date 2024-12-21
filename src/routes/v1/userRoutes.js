import express from "express";
import { userController } from "~/controllers/userController";

const router = express.Router();

router.route("/").get(userController.findAll).post(userController.createNew);
router.route("/:id").get(userController.findOne).put(userController.updateOne);

const userRoutes = router;
export default userRoutes;
