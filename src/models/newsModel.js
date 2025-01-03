import Joi from "joi";
import { ObjectId } from "mongodb";
import { env } from "~/config/environment";
import { GET_DB } from "~/config/mongodb";
import ApiError from "~/utils/ApiError";
import { checkImageType } from "~/utils/checkImageType";
import { StatusCodes } from "~/utils/statusCodes";
import { authorize, uploadFile } from "~/utils/uploadImage";
import { validateData } from "~/utils/validators";

const NEWS_COLLECTION_NAME = "newses";
const NEWS_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().trim().min(3).max(500),
  content: Joi.string().trim().min(3),
  shortDescription: Joi.string().trim().min(3).max(100),
  thumbnail: Joi.string().uri(),
  images: Joi.array().items(Joi.string().uri()).default([]),
  categories: Joi.string().trim().default(""),

  createdAt: Joi.date().timestamp("javascript").default(Date.now()),
  updatedAt: Joi.date().timestamp("javascript").default(null),
});

const uploadImages = async (files) => {
  if (!checkImageType(files)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid image type");
  }
  const authClient = await authorize();
  const images = await Promise.all(
    files.map(async (file) => {
      return await uploadFile(authClient, file, env.NEWSES_FOLDER_ID);
    })
  );

  return images;
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

    const thumbnail = (await uploadImages(req.files["thumbnail"]))[0];
    const images = await uploadImages(req.files["images"] ?? []);

    const createdNews = await GET_DB()
      .collection(NEWS_COLLECTION_NAME)
      .insertOne({ ...validatedData, thumbnail, images });

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

    const validatedData = await validateData(NEWS_COLLECTION_SCHEMA, req.body);

    if (req.files["thumbnail"] !== undefined) {
      validatedData["thumbnail"] = (
        await uploadImages(req.files["thumbnail"])
      )[0];
    }
    if (req.files["images"] !== undefined) {
      validatedData["images"] = await uploadImages(req.files["images"]);
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
