// admin wQELJrstipnS3Ixy



import { MongoClient, ServerApiVersion } from "mongodb";
import { env } from "./environment";

let dbInstance = null;

const mongoClient = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export const CONNECT_DB = async () => {
  await mongoClient.connect();
  dbInstance = mongoClient.db(env.DB_NAME);
};

export const GET_DB = () => {
  if (!dbInstance) {
    throw new Error("DB not connected");
  }

  return dbInstance;
};
