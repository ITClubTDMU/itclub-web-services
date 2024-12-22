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

const NEWS_COLLECTION_NAME = "newses";
const NEWS_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().trim().min(3).max(500),
  content: Joi.string().trim().min(3),
  shortDescription: Joi.string().trim().min(3).max(100),
  thumbnail: Joi.string().uri(),
  categories: Joi.array()
    .items(
      Joi.string()
        .trim()
        .pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE)
    )
    .default([]),

  createdAt: Joi.date().timestamp("javascript").default(Date.now()),
  updatedAt: Joi.date().timestamp("javascript").default(null),
});

const createNew = async (data) => {
  try {
    const validatedData = await validateData(NEWS_COLLECTION_SCHEMA, data);

    const createdNews = await GET_DB()
      .collection(NEWS_COLLECTION_NAME)
      .insertOne(validatedData);

    const { insertedId } = createdNews;
    const newNews = await findOneById(insertedId);
    return newNews;
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (id) => {
  try {
    const news = await GET_DB()
      .collection(NEWS_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) });

    return news;
  } catch (error) {
    throw new Error(error);
  }
};

const findOne = async (id) => {
  try {
    const news = await GET_DB()
      .collection(NEWS_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(id),
      });

    return news;
  } catch (error) {
    throw new Error(error);
  }
};

const findAll = async () => {
  try {
    const newses = await GET_DB()
      .collection(NEWS_COLLECTION_NAME)
      .find()
      .toArray();

    return newses;
  } catch (error) {
    throw new Error(error);
  }
};

const updateOne = async (id, data) => {
  try {
    const validatedData = await validateData(data);

    const updatedNews = await GET_DB()
      .collection(NEWS_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: validatedData },
        { returnDocument: "after" }
      );

    if (!updatedNews) {
      throw new ApiError(StatusCodes.NOT_FOUND, "News not found");
    }

    return updatedNews;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteOne = async (id) => {
  try {
    const deletedNews = await GET_DB()
      .collection(NEWS_COLLECTION_NAME)
      .findOneAndDelete({ _id: new ObjectId(id) });

    if (!deletedNews) {
      throw new ApiError(StatusCodes.NOT_FOUND, "News not found");
    }

    return deletedNews;
  } catch (error) {
    throw new Error(error);
  }
};

export const newsModel = {
  NEWS_COLLECTION_NAME,
  NEWS_COLLECTION_SCHEMA,
  createNew,
  findOne,
  findAll,
  updateOne,
  deleteOne,
};
