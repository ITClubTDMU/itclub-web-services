import { categoryService } from "~/services/categoryService";
import { Result } from "~/utils/result";
import { StatusCodes } from "~/utils/statusCodes";

const createNew = async (req, res, next) => {
  try {
    const category = req.body;
    console.log(category);
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
    const categories = await categoryService.findAll();
    res
      .status(StatusCodes.OK)
      .json(
        Result(StatusCodes.OK, "Get all categories successful", categories)
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
