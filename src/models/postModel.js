import { StatusCodes } from "~/utils/statusCodes";
import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";
import ApiError from "~/utils/ApiError";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";

const POST_COLLECTION_NAME = "posts";
const POST_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().trim().min(3).max(500),
  content: Joi.string().trim().min(3),
  images: Joi.array().items(Joi.string().uri()).default([]),
  categories: Joi.array()
    .items(
      Joi.string()
        .trim()
        .pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE)
    )
    .default([]), // array of category ids
  approved: Joi.boolean().default(false),
  favorites: Joi.array()
    .items(
      Joi.string()
        .trim()
        .pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE)
    )
    .default([]), // array of user ids

  createdAt: Joi.date().timestamp("javascript").default(Date.now()),
  updatedAt: Joi.date().timestamp("javascript").default(null),
});

const validateData = async (data) => {
  try {
    return await POST_COLLECTION_SCHEMA.validateAsync(data, {
      abortEarly: false,
    });
  } catch (error) {
    throw new Error(error);
  }
};

const createNew = async (data) => {
  try {
    const validatedData = await validateData(data);

    const createdPost = await GET_DB()
      .collection(POST_COLLECTION_NAME)
      .insertOne(validatedData);

    const { insertedId } = createdPost;
    const newPost = await findOneById(insertedId);
    return newPost;
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (id) => {
  try {
    const post = await GET_DB()
      .collection(POST_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) });

    return post;
  } catch (error) {
    throw new Error(error);
  }
};

const findOne = async (query) => {
  try {
    const post = await GET_DB().collection(POST_COLLECTION_NAME).findOne(query);

    return post;
  } catch (error) {
    throw new Error(error);
  }
};

const findAll = async () => {
  try {
    const posts = await GET_DB()
      .collection(POST_COLLECTION_NAME)
      .find()
      .toArray();

    return posts;
  } catch (error) {
    throw new Error(error);
  }
};

const updateOne = async (id, data) => {
  try {
    const validatedData = await validateData(data);

    const updatedPost = await GET_DB()
      .collection(POST_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: validatedData },
        { returnDocument: "after" }
      );

    if (!updatedPost) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Post not found");
    }

    return updatedPost;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteOne = async (id) => {
  try {
    const deletedPost = await GET_DB()
      .collection(POST_COLLECTION_NAME)
      .findOneAndDelete({ _id: new ObjectId(id) });

    if (!deletedPost) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Post not found");
    }

    return deletedPost;
  } catch (error) {
    throw new Error(error);
  }
};

export const postModel = {
  POST_COLLECTION_NAME,
  POST_COLLECTION_SCHEMA,
  createNew,
  findOne,
  findAll,
  updateOne,
  deleteOne,
};
