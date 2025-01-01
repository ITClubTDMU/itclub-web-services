import { newsModel } from "~/models/newsModel";
import ApiError from "~/utils/ApiError";
import { StatusCodes } from "~/utils/statusCodes";

const createNew = async (req) => {
  try {
    const createdNews = await newsModel.createNew(req);

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
    const news = await newsModel.findOne(id);
    if (news === null) {
      throw new ApiError(StatusCodes.NOT_FOUND, "News not found");
    }
    return news;
  } catch (error) {
    throw error;
  }
};

const updateOne = async (req) => {
  try {
    const updatedNews = await newsModel.updateOne(req);
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
