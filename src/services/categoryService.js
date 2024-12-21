import { categoryModel } from "~/models/categoryModel";
import { ObjectId } from "mongodb";
import ApiError from "~/utils/ApiError";
import { StatusCodes } from "~/utils/statusCodes";

const createNew = async (reqBody) => {
  try {
    const createdCategory = await categoryModel.createNew(reqBody);

    return createdCategory;
  } catch (error) {
    throw error;
  }
};

const findAll = async () => {
  try {
    const categories = await categoryModel.findAll();
    return categories;
  } catch (error) {
    throw error;
  }
};

const findOne = async (id) => {
  try {
    const category = await categoryModel.findOne({
      _id: new ObjectId(id),
    });
    if (category === null) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Category not found");
    }
    return category;
  } catch (error) {
    throw error;
  }
};

const updateOne = async (id, data) => {
  try {
    const updatedCategory = await categoryModel.updateOne(id, data);
    return updatedCategory;
  } catch (error) {
    throw error;
  }
};

const deleteOne = async (id) => {
  try {
    const deletedCategory = await categoryModel.deleteOne(id);
    return deletedCategory;
  } catch (error) {
    throw error;
  }
};

export const categoryService = {
  createNew,
  findAll,
  findOne,
  updateOne,
  deleteOne,
};
