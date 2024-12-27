import { StatusCodes } from "~/utils/statusCodes";
import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";
import ApiError from "~/utils/ApiError";
import { validateData } from "~/utils/validators";

const USER_COLLECTION_NAME = "users";
const USER_COLLECTION_SCHEMA = Joi.object({
  username: Joi.string().trim().alphanum().min(3).max(30),
  password: Joi.string().trim().min(8).max(30),
  email: Joi.string().trim().email(),
  roles: Joi.array()
    .items(Joi.string().valid("user", "admin"))
    .default(["user"]),
  fullName: Joi.string().trim().min(3).max(50).default("Anonymous"),
  avatar: Joi.string().uri().default("/avatar_member.webp"),
  labels: Joi.array().items(Joi.string().trim().min(3).max(30)).default([]),
  contribution: Joi.number().integer().min(0).default(0),

  createdAt: Joi.date().timestamp("javascript").default(Date.now()),
  updatedAt: Joi.date().timestamp("javascript").default(null),
  _destroy: Joi.boolean().default(false),
});

const createNew = async (data) => {
  try {
    const validatedData = await validateData(USER_COLLECTION_SCHEMA, data);

    const createdUser = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .insertOne(validatedData);

    const { insertedId } = createdUser;
    const newUser = await findOneById(insertedId);
    return newUser;
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (id) => {
  try {
    const user = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) });

    return user;
  } catch (error) {
    throw new Error(error);
  }
};

const findOne = async (query) => {
  try {
    const user = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne({
        $or: [{ username: query }, { email: query }],
      });

    return user;
  } catch (error) {
    throw new Error(error);
  }
};

const findAll = async () => {
  try {
    const users = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .find({ _destroy: false })
      .toArray();

    return users;
  } catch (error) {
    throw new Error(error);
  }
};

const updateOne = async (id, data) => {
  try {
    const validatedData = await validateData(USER_COLLECTION_SCHEMA, data);

    const updatedUser = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOneAndUpdate(
        { $or: [{ username: id }, { email: id }] },
        { $set: validatedData },
        { returnDocument: "after" }
      );

    console.log(updatedUser);

    if (!updatedUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }

    return updatedUser;
  } catch (error) {
    throw new Error(error);
  }
};

export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  createNew,
  findOne,
  findAll,
  updateOne,
};
