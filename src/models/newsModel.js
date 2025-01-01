import Joi from "joi";
import { ObjectId } from "mongodb";
import { env } from "~/config/environment";
import { GET_DB } from "~/config/mongodb";
import ApiError from "~/utils/ApiError";
import { StatusCodes } from "~/utils/statusCodes";
import { authorize } from "~/utils/uploadImage";
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
  images: Joi.array().items(Joi.optional()).default([]),
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

const uploadImages = async (files) => {
  const authClient = await authorize();
  const images = await Promise.all(
    files.map(async (file) => {
      return await uploadFile(authClient, file, env.NEWSES_FOLDER_ID);
    })
  );

  return images;
};

const createNew = async (data) => {
  try {
    const validatedData = await validateData(NEWS_COLLECTION_SCHEMA, data);
    const images = await uploadImages(data.images);

    const createdNews = await GET_DB()
      .collection(NEWS_COLLECTION_NAME)
      .insertOne({ ...validatedData, images });

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
    const validatedData = await validateData(NEWS_COLLECTION_SCHEMA, data);
    const images = await uploadImages(data.images);

    const updatedNews = await GET_DB()
      .collection(NEWS_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { ...validatedData, images } },
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
