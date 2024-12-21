import { newsService } from "~/services/newsService";
import { Result } from "~/utils/result";
import { StatusCodes } from "~/utils/statusCodes";

const createNew = async (req, res, next) => {
  try {
    const news = req.body;
    console.log(news);
    const newNews = await newsService.createNew(news);
    res
      .status(StatusCodes.CREATED)
      .json(Result(StatusCodes.CREATED, "Create new news successful", newNews));
  } catch (error) {
    next(error);
  }
};

const findAll = async (req, res, next) => {
  try {
    const newses = await newsService.findAll();
    res
      .status(StatusCodes.OK)
      .json(Result(StatusCodes.OK, "Get all news successful", newses));
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const news = await newsService.findOne(id);
    res.status(StatusCodes.OK).json(news);
  } catch (error) {
    next(error);
  }
};

const updateOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedNews = await newsService.updateOne(id, data);
    res
      .status(StatusCodes.OK)
      .json(Result(StatusCodes.OK, "Update news successful", updatedNews));
  } catch (error) {
    next(error);
  }
};

const deleteOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedNews = await newsService.deleteOne(id);
    res
      .status(StatusCodes.OK)
      .json(Result(StatusCodes.OK, "Delete news successful", deletedNews));
  } catch (error) {
    next(error);
  }
};

export const newsController = {
  createNew,
  findAll,
  findOne,
  updateOne,
  deleteOne,
};
