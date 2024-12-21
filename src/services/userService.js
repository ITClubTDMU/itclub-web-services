import { StatusCodes } from "~/utils/statusCodes";
import ApiError from "~/utils/ApiError";

import { userModel } from "~/models/userModel";
import { ObjectId } from "mongodb";

const validateRequest = async (reqBody) => {
  const { username, password, email } = reqBody;
  if (username && email) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Provide either username or email, not both"
    );
  } else if (!username) {
    if (!email) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Provide username or email");
    }
  } else if (!password) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Provide password");
  }

  return reqBody;
};

const createNew = async (reqBody) => {
  try {
    const body = await validateRequest(reqBody);
    const query = body.email
      ? { email: body.email }
      : { username: body.username, password: body.password };
    if (await userModel.findOne(query)) {
      throw new ApiError(StatusCodes.CONFLICT, "User already exists");
    }

    const newUser = await userModel.createNew(query);
    return newUser;
  } catch (error) {
    throw error;
  }
};

const findAll = async () => {
  try {
    const users = await userModel.findAll();
    return users;
  } catch (error) {
    throw error;
  }
};

const findOne = async (query) => {
  try {
    const user = await userModel.findOne({
      $or: [{ username: query }, { email: query }, { refreshToken: query }],
    });
    return user;
  } catch (error) {
    throw error;
  }
};

const updateOne = async (id, data) => {
  try {
    const updatedUser = await userModel.updateOne(id, data);
    return updatedUser;
  } catch (error) {
    throw error;
  }
};

export const userService = {
  validateRequest,
  createNew,
  findAll,
  findOne,
  updateOne,
};
