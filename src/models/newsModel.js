import Joi from "joi";
import { ObjectId } from "mongodb";
import { env } from "~/config/environment";
import { GET_DB } from "~/config/mongodb";
import ApiError from "~/utils/ApiError";
import { checkImageType } from "~/utils/checkImageType";
import { StatusCodes } from "~/utils/statusCodes";
import {
  authorize,
  createFolder,
  deleteFolder,
  uploadFile,
} from "~/utils/googleDriveHandle";
import { validateData } from "~/utils/validators";

const NEWS_COLLECTION_NAME = "newses";
const NEWS_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().trim().min(3),
  content: Joi.string().trim().min(3),
  shortDescription: Joi.string().trim().min(3),
  thumbnail: Joi.string().uri(),
  images: Joi.array().items(Joi.string().uri()).default([]),
  categories: Joi.string().trim().default(""),
  driveFolderId: Joi.string().trim().default(""),

  createdAt: Joi.date().timestamp("javascript").default(Date.now()),
  updatedAt: Joi.date().timestamp("javascript").default(null),
});
const NEWS_COLLECTION_VALIDATE = Joi.object({
  title: Joi.string().trim().min(3),
  content: Joi.string().trim().min(3),
  shortDescription: Joi.string().trim().min(3),
  thumbnail: Joi.string().uri(),
  images: Joi.array().items(Joi.string().uri()),
  categories: Joi.string().trim(),
  driveFolderId: Joi.string().trim(),

  createdAt: Joi.date().timestamp("javascript"),
  updatedAt: Joi.date().timestamp("javascript"),
});

const uploadImages = async (files, authClient, folderId) => {
  try {
    if (!checkImageType(files)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid image type");
    }

    const images = await Promise.all(
      files.map(async (file) => await uploadFile(authClient, file, folderId))
    );

    return images;
  } catch (error) {
    throw new Error(error);
  }
};

const createNew = async (req) => {
  try {
    const validatedData = await validateData(NEWS_COLLECTION_SCHEMA, req.body);
    if (!validatedData.title || !validatedData.content) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Title and content are required"
      );
    } else if (req.files["thumbnail"] === undefined) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Thumbnail is required");
    }

    const authClient = await authorize();
    const folderId = await createFolder(
      authClient,
      new Date().toISOString(),
      env.NEWSES_FOLDER_ID
    );

    const thumbnail = (
      await uploadImages(req.files["thumbnail"], authClient, folderId)
    )[0];

    const images = await uploadImages(
      req.files["images"] ?? [],
      authClient,
      folderId
    );

    const createdNews = await GET_DB()
      .collection(NEWS_COLLECTION_NAME)
      .insertOne({
        ...validatedData,
        thumbnail,
        images,
        driveFolderId: folderId,
      });

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

const updateOne = async (req) => {
  try {
    const { id } = req.params;
    const news = await findOne(id);

    const validatedData = await validateData(
      NEWS_COLLECTION_VALIDATE,
      req.body
    );

    const authClient = await authorize();
    if (req.files["thumbnail"] !== undefined) {
      validatedData["thumbnail"] = (
        await uploadImages(
          req.files["thumbnail"],
          authClient,
          news.driveFolderId
        )
      )[0];
    }
    if (req.files["images"] !== undefined) {
      validatedData["images"] = await uploadImages(
        req.files["images"] ?? [],
        authClient,
        news.driveFolderId
      );
    }

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

    const authClient = await authorize();
    await deleteFolder(authClient, deletedNews.driveFolderId);

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
