import { postModel } from "~/models/postModel";
import ApiError from "~/utils/ApiError";
import { StatusCodes } from "~/utils/statusCodes";

const createNew = async (reqBody) => {
  try {
    const createdPost = await postModel.createNew(reqBody);

    return createdPost;
  } catch (error) {
    throw error;
  }
};

const findAll = async () => {
  try {
    const posts = await postModel.findAll();
    return posts;
  } catch (error) {
    throw error;
  }
};

const findOne = async (id) => {
  try {
    const post = await postModel.findOne(id);
    if (post === null) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Post not found");
    }
    return post;
  } catch (error) {
    throw error;
  }
};

const updateOne = async (id, data) => {
  try {
    const updatedPost = await postModel.updateOne(id, data);
    return updatedPost;
  } catch (error) {
    throw error;
  }
};

const deleteOne = async (id) => {
  try {
    const deletedPost = await postModel.deleteOne(id);
    return deletedPost;
  } catch (error) {
    throw error;
  }
};

export const postService = {
  createNew,
  findAll,
  findOne,
  updateOne,
  deleteOne,
};
