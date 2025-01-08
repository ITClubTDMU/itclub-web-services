import { categoryService } from "~/services/categoryService";
import { Result } from "~/utils/result";
import { StatusCodes } from "~/utils/statusCodes";

const createNew = async (req, res, next) => {
  try {
    const category = req.body;
    // console.log(category);
    const newCategory = await categoryService.createNew(category);
    res
      .status(StatusCodes.CREATED)
      .json(
        Result(
          StatusCodes.CREATED,
          "Create new category successful",
          newCategory
        )
      );
  } catch (error) {
    next(error);
  }
};

const findAll = async (req, res, next) => {
  try {
    const { pageNumber, pageSize, sortBy, order, search } = req.query;

    const categories = await categoryService.findAll();

    const filter = {
      pageNumber: pageNumber ? parseInt(pageNumber) : 1,
      pageSize: pageSize ? parseInt(pageSize) : Number.MAX_VALUE,
      sortBy: sortBy ? sortBy : "createdAt",
      order: order ? order : "desc",
      search: search ? search : "",
    };

    const searchedCategories = categories.filter((category) => {
      return category.categoryName
        .toLowerCase()
        .includes(filter.search.toLowerCase());
    });

    const sortedCategories = searchedCategories.sort((a, b) => {
      if (filter.order === "asc") {
        return a[filter.sortBy] > b[filter.sortBy] ? 1 : -1;
      } else {
        return a[filter.sortBy] < b[filter.sortBy] ? 1 : -1;
      }
    });

    const paginatedCategories = sortedCategories.slice(
      (filter.pageNumber - 1) * filter.pageSize,
      filter.pageNumber * filter.pageSize
    );

    res
      .status(StatusCodes.OK)
      .json(
        Result(
          StatusCodes.OK,
          "Get categories successful",
          paginatedCategories
        )
      );
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await categoryService.findOne(id);
    res
      .status(StatusCodes.OK)
      .json(Result(StatusCodes.OK, "Get category successful", category));
  } catch (error) {
    next(error);
  }
};

const updateOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedCategory = await categoryService.updateOne(id, data);
    res
      .status(StatusCodes.OK)
      .json(
        Result(StatusCodes.OK, "Update category successful", updatedCategory)
      );
  } catch (error) {
    next(error);
  }
};

const deleteOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedCategory = await categoryService.deleteOne(id);
    res
      .status(StatusCodes.OK)
      .json(
        Result(StatusCodes.OK, "Delete category successful", deletedCategory)
      );
  } catch (error) {
    next(error);
  }
};

export const categoryController = {
  createNew,
  findAll,
  findOne,
  updateOne,
  deleteOne,
};
