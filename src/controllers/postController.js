import { postService } from "~/services/postService";
import { Result } from "~/utils/result";
import { StatusCodes } from "~/utils/statusCodes";

const createNew = async (req, res, next) => {
  try {
    const post = req.body;
    console.log(post);
    const newPost = await postService.createNew(post);
    res
      .status(StatusCodes.CREATED)
      .json(Result(StatusCodes.CREATED, "Create new post successful", newPost));
  } catch (error) {
    next(error);
  }
};

const findAll = async (req, res, next) => {
  try {
    const posts = await postService.findAll();
    res
      .status(StatusCodes.OK)
      .json(Result(StatusCodes.OK, "Get all posts successful", posts));
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await postService.findOne(id);
    res
      .status(StatusCodes.OK)
      .json(Result(StatusCodes.OK, "Get post successful", post));
  } catch (error) {
    next(error);
  }
};

const updateOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedPost = await postService.updateOne(id, data);
    res
      .status(StatusCodes.OK)
      .json(Result(StatusCodes.OK, "Update post successful", updatedPost));
  } catch (error) {
    next(error);
  }
};

const deleteOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedPost = await postService.deleteOne(id);
    res
      .status(StatusCodes.OK)
      .json(Result(StatusCodes.OK, "Delete post successful", deletedPost));
  } catch (error) {
    next(error);
  }
};

export const postController = {
  createNew,
  findAll,
  findOne,
  updateOne,
  deleteOne,
};
