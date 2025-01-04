import { env } from "~/config/environment";
import { newsService } from "~/services/newsService";
import {
  authorize,
  deleteFiles,
  getFilesInFolder,
} from "~/utils/googleDriveHandle";
import { Result } from "~/utils/result";
import { StatusCodes } from "~/utils/statusCodes";

const refreshNews = async (req, res, next) => {
  try {
    const getFileIds = async (newses) => {
      const fileIds = [];
      await Promise.all(
        newses.map(async (news) => {
          const thumbnailId = news.thumbnail.split("/d/")[1];
          fileIds.push(thumbnailId);
          await Promise.all(
            news.images.map(async (image) => {
              const imageId = image.split("/d/")[1];
              fileIds.push(imageId);
            })
          );
        })
      );

      return fileIds;
    };

    const newses = await newsService.findAll();
    const fileIds = await getFileIds(newses);
    const authClient = await authorize();
    const newsFiles = await getFilesInFolder(authClient, env.NEWSES_FOLDER_ID);

    const newsFiltered = newsFiles.filter((file) => !fileIds.includes(file));
    await deleteFiles(authClient, newsFiltered);

    res
      .status(StatusCodes.OK)
      .json(Result(StatusCodes.OK, "Refresh newses successful", newsFiltered));
  } catch (error) {
    next(error);
  }
};

export const refreshGoogleDriveController = {
  refreshNews,
};
