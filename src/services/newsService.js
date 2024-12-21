import { newsModel } from "~/models/newsModel";
import { ObjectId } from "mongodb";
import ApiError from "~/utils/ApiError";
import { StatusCodes } from "~/utils/statusCodes";

const createNew = async (reqBody) => {
  try {
    const createdNews = await newsModel.createNew(reqBody);

    return createdNews;
  } catch (error) {
    throw error;
  }
};

const findAll = async () => {
  try {
    const newses = await newsModel.findAll();
    return newses;
  } catch (error) {
    throw error;
  }
};

const findOne = async (id) => {
  try {
    const news = await newsModel.findOne({
      _id: new ObjectId(id),
    });
    if (news === null) {
      throw new ApiError(StatusCodes.NOT_FOUND, "News not found");
    }
    return news;
  } catch (error) {
    throw error;
  }
};

const updateOne = async (id, data) => {
  try {
    const updatedNews = await newsModel.updateOne(id, data);
    return updatedNews;
  } catch (error) {
    throw error;
  }
};

const deleteOne = async (id) => {
  try {
    const deletedNews = await newsModel.deleteOne(id);
    return deletedNews;
  } catch (error) {
    throw error;
  }
};

export const newsService = {
  createNew,
  findAll,
  findOne,
  updateOne,
  deleteOne,
};
