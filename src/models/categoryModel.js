import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";
import ApiError from "~/utils/ApiError";
import { StatusCodes } from "~/utils/statusCodes";
import { validateData } from "~/utils/validators";

const CATEGORY_COLLECTION_NAME = "categories";
const CATEGORY_COLLECTION_SCHEMA = Joi.object({
  categoryName: Joi.string().trim().min(1).max(100),

  createdAt: Joi.date().timestamp("javascript").default(Date.now()),
  updatedAt: Joi.date().timestamp("javascript").default(null),
});

const createNew = async (data) => {
  try {
    const validatedData = await validateData(CATEGORY_COLLECTION_SCHEMA, data);
    if (!validatedData.categoryName.trim()) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Category name is required");
    }

    const createdCategory = await GET_DB()
      .collection(CATEGORY_COLLECTION_NAME)
      .insertOne(validatedData);

    const { insertedId } = createdCategory;
    const newCategory = await findOneById(insertedId);
    return newCategory;
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (id) => {
  try {
    const category = await GET_DB()
      .collection(CATEGORY_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) });

    return category;
  } catch (error) {
    throw new Error(error);
  }
};

const findOne = async (id) => {
  try {
    const category = await GET_DB()
      .collection(CATEGORY_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(id),
      });

    return category;
  } catch (error) {
    throw new Error(error);
  }
};

const findAll = async () => {
  try {
    const categories = await GET_DB()
      .collection(CATEGORY_COLLECTION_NAME)
      .find()
      .toArray();

    return categories;
  } catch (error) {
    throw new Error(error);
  }
};

const updateOne = async (id, data) => {
  try {
    const validatedData = await validateData(CATEGORY_COLLECTION_SCHEMA, data);

    const updatedCategory = await GET_DB()
      .collection(CATEGORY_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: validatedData },
        { returnDocument: "after" }
      );

    if (!updatedCategory) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Category not found");
    }

    return updatedCategory;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteOne = async (id) => {
  try {
    const deletedCategory = await GET_DB()
      .collection(CATEGORY_COLLECTION_NAME)
      .findOneAndDelete({ _id: new ObjectId(id) });

    if (!deletedCategory) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Category not found");
    }

    return deletedCategory;
  } catch (error) {
    throw new Error(error);
  }
};

export const categoryModel = {
  CATEGORY_COLLECTION_NAME,
  CATEGORY_COLLECTION_SCHEMA,
  createNew,
  findOne,
  findAll,
  updateOne,
  deleteOne,
};
