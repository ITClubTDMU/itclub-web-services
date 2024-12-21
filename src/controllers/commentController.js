import { commentService } from "~/services/commentService";
import { Result } from "~/utils/result";
import { StatusCodes } from "~/utils/statusCodes";

const createNew = async (req, res, next) => {
  try {
    const comment = req.body;
    console.log(comment);
    const newComment = await commentService.createNew(comment);
    res
      .status(StatusCodes.CREATED)
      .json(
        Result(StatusCodes.CREATED, "Create new comment successful", newComment)
      );
  } catch (error) {
    next(error);
  }
};

const findAll = async (req, res, next) => {
  try {
    const comments = await commentService.findAll();
    res
      .status(StatusCodes.OK)
      .json(Result(StatusCodes.OK, "Get all comments successful", comments));
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const comment = await commentService.findOne(id);
    res
      .status(StatusCodes.OK)
      .json(Result(StatusCodes.OK, "Get comment successful", comment));
  } catch (error) {
    next(error);
  }
};

const updateOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedComment = await commentService.updateOne(id, data);
    res
      .status(StatusCodes.OK)
      .json(
        Result(StatusCodes.OK, "Update comment successful", updatedComment)
      );
  } catch (error) {
    next(error);
  }
};

const deleteOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedComment = await commentService.deleteOne(id);
    res
      .status(StatusCodes.OK)
      .json(
        Result(StatusCodes.OK, "Delete comment successful", deletedComment)
      );
  } catch (error) {
    next(error);
  }
};

export const commentController = {
  createNew,
  findAll,
  findOne,
  updateOne,
  deleteOne,
};
