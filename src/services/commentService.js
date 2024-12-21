import { commentModel } from "~/models/commentModel";
import { ObjectId } from "mongodb";
import ApiError from "~/utils/ApiError";
import { StatusCodes } from "~/utils/statusCodes";

const createNew = async (reqBody) => {
  try {
    const createdComment = await commentModel.createNew(reqBody);

    return createdComment;
  } catch (error) {
    throw error;
  }
};

const findAll = async () => {
  try {
    const comments = await commentModel.findAll();
    return comments;
  } catch (error) {
    throw error;
  }
};

const findOne = async (id) => {
  try {
    const comment = await commentModel.findOne({
      _id: new ObjectId(id),
    });
    if (comment === null) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Comment not found");
    }
    return comment;
  } catch (error) {
    throw error;
  }
};

const updateOne = async (id, data) => {
  try {
    const updatedComment = await commentModel.updateOne(id, data);
    return updatedComment;
  } catch (error) {
    throw error;
  }
};

const deleteOne = async (id) => {
  try {
    const deletedComment = await commentModel.deleteOne(id);
    return deletedComment;
  } catch (error) {
    throw error;
  }
};

export const commentService = {
  createNew,
  findAll,
  findOne,
  updateOne,
  deleteOne,
};
