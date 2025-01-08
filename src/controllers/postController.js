import { postService } from "~/services/postService";
import { Result } from "~/utils/result";
import { StatusCodes } from "~/utils/statusCodes";

const createNew = async (req, res, next) => {
  try {
    const post = req.body;
    // console.log(post);
    const newPost = await postService.createNew(post);
    res
      .status(StatusCodes.CREATED)
      .json(Result(StatusCodes.CREATED, "Create new post successful", newPost));
  } catch (error) {
    next(error);
  }
};

const findAll = async (req, res, next) => {
  try {
    const { pageNumber, pageSize, sortBy, order, search } = req.query;

    const posts = await postService.findAll();

    const filter = {
      pageNumber: pageNumber ? parseInt(pageNumber) : 1,
      pageSize: pageSize ? parseInt(pageSize) : Number.MAX_VALUE,
      sortBy: sortBy ? sortBy : "createdAt",
      order: order ? order : "desc",
      search: search ? search : "",
    };

    const searchedPosts = posts.filter((post) => {
      return (
        post.title.toLowerCase().includes(filter.search.toLowerCase()) ||
        post.content.toLowerCase().includes(filter.search.toLowerCase())
      );
    });

    const sortedPosts = searchedPosts.sort((a, b) => {
      if (filter.order === "asc") {
        return a[filter.sortBy] > b[filter.sortBy] ? 1 : -1;
      } else {
        return a[filter.sortBy] < b[filter.sortBy] ? 1 : -1;
      }
    });

    const paginatedPosts = sortedPosts.slice(
      (filter.pageNumber - 1) * filter.pageSize,
      filter.pageNumber * filter.pageSize
    );

    res
      .status(StatusCodes.OK)
      .json(Result(StatusCodes.OK, "Get posts successful", paginatedPosts));
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await postService.findOne(id);
    res
      .status(StatusCodes.OK)
      .json(Result(StatusCodes.OK, "Get post successful", post));
  } catch (error) {
    next(error);
  }
};

const updateOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedPost = await postService.updateOne(id, data);
    res
      .status(StatusCodes.OK)
      .json(Result(StatusCodes.OK, "Update post successful", updatedPost));
  } catch (error) {
    next(error);
  }
};

const deleteOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedPost = await postService.deleteOne(id);
    res
      .status(StatusCodes.OK)
      .json(Result(StatusCodes.OK, "Delete post successful", deletedPost));
  } catch (error) {
    next(error);
  }
};

export const postController = {
  createNew,
  findAll,
  findOne,
  updateOne,
  deleteOne,
};
