import { userService } from "~/services/userService";
import { Result } from "~/utils/result";
import { StatusCodes } from "~/utils/statusCodes";

const createNew = async (req, res, next) => {
  try {
    const user = req.body;
    console.log(user);
    const newUser = await userService.createNew(user);
    res
      .status(StatusCodes.CREATED)
      .json(Result(StatusCodes.CREATED, "Create new user successful", newUser));
  } catch (error) {
    next(error);
  }
};

const findAll = async (req, res, next) => {
  try {
    const users = await userService.findAll();
    res
      .status(StatusCodes.OK)
      .json(Result(StatusCodes.OK, "Get all users successful", users));
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userService.findOne(id);
    res
      .status(StatusCodes.OK)
      .json(Result(StatusCodes.OK, "Get user successful", user));
  } catch (error) {
    next(error);
  }
};

const updateOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedUser = await userService.updateOne(id, data);
    res
      .status(StatusCodes.OK)
      .json(Result(StatusCodes.OK, "Update user successful", updatedUser));
  } catch (error) {
    next(error);
  }
};

export const userController = {
  createNew,
  findAll,
  findOne,
  updateOne,
};
