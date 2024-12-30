import { userService } from "~/services/userService";
import { Result } from "~/utils/result";
import { StatusCodes } from "~/utils/statusCodes";

const createNew = async (req, res, next) => {
  try {
    const user = req.body;
    console.log(user);
    const newUser = await userService.createNew(user);
    res
      .status(StatusCodes.CREATED)
      .json(Result(StatusCodes.CREATED, "Create new user successful", newUser));
  } catch (error) {
    next(error);
  }
};

const findAll = async (req, res, next) => {
  try {
    const { pageNumber, pageSize, sortBy, order, search } = req.query;

    const users = await userService.findAll();

    const filter = {
      pageNumber: pageNumber ? parseInt(pageNumber) : 1,
      pageSize: pageSize ? parseInt(pageSize) : Number.MAX_VALUE,
      sortBy: sortBy ? sortBy : "createdAt",
      order: order ? order : "desc",
      search: search ? search : "",
    };

    const searchedUsers = users.filter((user) => {
      return (
        (user.username !== undefined &&
          user.username.toLowerCase().includes(filter.search.toLowerCase())) ||
        (user.email !== undefined &&
          user.email.toLowerCase().includes(filter.search.toLowerCase())) ||
        user.fullName.toLowerCase().includes(filter.search.toLowerCase())
      );
    });

    const sortedUsers = searchedUsers.sort((a, b) => {
      if (filter.order === "asc") {
        return a[filter.sortBy] > b[filter.sortBy] ? 1 : -1;
      } else {
        return a[filter.sortBy] < b[filter.sortBy] ? 1 : -1;
      }
    });

    const paginatedUsers = sortedUsers.slice(
      (filter.pageNumber - 1) * filter.pageSize,
      filter.pageNumber * filter.pageSize
    );

    res
      .status(StatusCodes.OK)
      .json(Result(StatusCodes.OK, "Get users successful", paginatedUsers));
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userService.findOne(id);
    res
      .status(StatusCodes.OK)
      .json(Result(StatusCodes.OK, "Get user successful", user));
  } catch (error) {
    next(error);
  }
};

const updateOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedUser = await userService.updateOne(id, data);
    res
      .status(StatusCodes.OK)
      .json(Result(StatusCodes.OK, "Update user successful", updatedUser));
  } catch (error) {
    next(error);
  }
};

export const userController = {
  createNew,
  findAll,
  findOne,
  updateOne,
};
