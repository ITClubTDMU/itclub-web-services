import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";
import ApiError from "~/utils/ApiError";
import { StatusCodes } from "~/utils/statusCodes";
import {
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
  validateData,
} from "~/utils/validators";

const COMMENT_COLLECTION_NAME = "comments";
const COMMENT_COLLECTION_SCHEMA = Joi.object({
  postId: Joi.string()
    .trim()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  userId: Joi.string()
    .trim()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  content: Joi.string().trim().min(3),
  images: Joi.array().items(Joi.string().uri()).default([]),
  approved: Joi.boolean().default(false),
  favorites: Joi.array()
    .items(
      Joi.string()
        .trim()
        .pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE)
    )
    .default([]), // array of user ids
  replies: Joi.array()
    .items(
      Joi.string()
        .trim()
        .pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE)
    )
    .default([]), // array of comment ids

  createdAt: Joi.date().timestamp("javascript").default(Date.now()),
  updatedAt: Joi.date().timestamp("javascript").default(null),
});

const createNew = async (data) => {
  try {
    const validatedData = await validateData(COMMENT_COLLECTION_SCHEMA, data);
    if (
      !validatedData.postId.trim() ||
      !validatedData.userId.trim() ||
      !validatedData.content.trim()
    ) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Post id, user id, and content are required"
      );
    }

    const createdComment = await GET_DB()
      .collection(COMMENT_COLLECTION_NAME)
      .insertOne(validatedData);

    const { insertedId } = createdComment;
    const newComment = await findOneById(insertedId);
    return newComment;
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (id) => {
  try {
    const comment = await GET_DB()
      .collection(COMMENT_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) });

    return comment;
  } catch (error) {
    throw new Error(error);
  }
};

const findOne = async (id) => {
  try {
    const comment = await GET_DB()
      .collection(COMMENT_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(id),
      });

    return comment;
  } catch (error) {
    throw new Error(error);
  }
};

const findAll = async () => {
  try {
    const comments = await GET_DB()
      .collection(COMMENT_COLLECTION_NAME)
      .find()
      .toArray();

    return comments;
  } catch (error) {
    throw new Error(error);
  }
};

const updateOne = async (id, data) => {
  try {
    const validatedData = await validateData(COMMENT_COLLECTION_SCHEMA, data);

    const updatedComment = await GET_DB()
      .collection(COMMENT_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: validatedData },
        { returnDocument: "after" }
      );

    if (!updatedComment) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Comment not found");
    }

    return updatedComment;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteOne = async (id) => {
  try {
    const deletedComment = await GET_DB()
      .collection(COMMENT_COLLECTION_NAME)
      .findOneAndDelete({ _id: new ObjectId(id) });

    if (!deletedComment) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Comment not found");
    }

    return deletedComment;
  } catch (error) {
    throw new Error(error);
  }
};

export const commentModel = {
  COMMENT_COLLECTION_NAME,
  COMMENT_COLLECTION_SCHEMA,
  createNew,
  findOne,
  findAll,
  updateOne,
  deleteOne,
};
