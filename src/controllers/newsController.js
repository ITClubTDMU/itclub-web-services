import { env } from "~/config/environment";
import { newsService } from "~/services/newsService";
import ApiError from "~/utils/ApiError";
import { checkImageType } from "~/utils/checkImageType";
import { Result } from "~/utils/result";
import { StatusCodes } from "~/utils/statusCodes";
import { authorize, uploadFile } from "~/utils/uploadImage";

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

const createNew = async (req, res, next) => {
  try {
    const news = req.body;
    const thumbnail = (await uploadImages(req.files["thumbnail"]))[0];
    const images = await uploadImages(req.files["images"] ?? []);

    const newNews = await newsService.createNew({ ...news, thumbnail, images });
    res
      .status(StatusCodes.CREATED)
      .json(Result(StatusCodes.CREATED, "Create new news successful", newNews));
  } catch (error) {
    next(error);
  }
};

const findAll = async (req, res, next) => {
  try {
    const { pageNumber, pageSize, sortBy, order, search } = req.query;

    const newses = await newsService.findAll();

    const filter = {
      pageNumber: pageNumber ? parseInt(pageNumber) : 1,
      pageSize: pageSize ? parseInt(pageSize) : Number.MAX_VALUE,
      sortBy: sortBy ? sortBy : "createdAt",
      order: order ? order : "desc",
      search: search ? search : "",
    };

    const searchedNewses = newses.filter((news) => {
      return (
        news.title.toLowerCase().includes(filter.search.toLowerCase()) ||
        news.content.toLowerCase().includes(filter.search.toLowerCase()) ||
        news.shortDescription
          .toLowerCase()
          .includes(filter.search.toLowerCase())
      );
    });

    const sortedNewses = searchedNewses.sort((a, b) => {
      if (filter.order === "asc") {
        return a[filter.sortBy] > b[filter.sortBy] ? 1 : -1;
      } else {
        return a[filter.sortBy] < b[filter.sortBy] ? 1 : -1;
      }
    });

    const paginatedNewses = sortedNewses.slice(
      (filter.pageNumber - 1) * filter.pageSize,
      filter.pageNumber * filter.pageSize
    );

    res
      .status(StatusCodes.OK)
      .json(Result(StatusCodes.OK, "Get newses successful", paginatedNewses));
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const news = await newsService.findOne(id);
    res
      .status(StatusCodes.OK)
      .json(Result(StatusCodes.OK, "Get news successful", news));
  } catch (error) {
    next(error);
  }
};

const updateOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const thumbnail = (await uploadImages(req.files["thumbnail"]))[0];
    const images = await uploadImages(req.files["images"] ?? []);
    const updatedNews = await newsService.updateOne(id, {
      ...data,
      thumbnail,
      images,
    });

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
