/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import "dotenv/config";

export const env = {
  MONGODB_URI: process.env.MONGODB_URI,
  DB_NAME: process.env.DB_NAME,
  APP_HOST: process.env.APP_HOST,
  APP_PORT: process.env.APP_PORT,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  BUILD_MODE: process.env.BUILD_MODE,
  SERVICE_EMAIL: process.env.SERVICE_EMAIL,
  USER_AUTH: process.env.USER_AUTH,
  PASS_AUTH: process.env.PASS_AUTH,
  CLIENT_EMAIL: process.env.CLIENT_EMAIL,
  PRIVATE_KEY: process.env.PRIVATE_KEY,
  NEWSES_FOLDER_ID: process.env.NEWSES_FOLDER_ID,
  ACTIVITIES_FOLDER_ID: process.env.ACTIVITIES_FOLDER_ID,
  USERS_FOLDER_ID: process.env.USERS_FOLDER_ID,
  AVATAR_USERS_FOLDER_ID: process.env.AVATAR_USERS_FOLDER_ID,
};
