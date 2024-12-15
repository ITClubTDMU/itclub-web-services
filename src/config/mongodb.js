// admin wQELJrstipnS3Ixy



import { MongoClient, ServerApiVersion } from "mongodb";

let dbInstance = null;

const mongoClient = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export const CONNECT_DB = async () => {
  await mongoClient.connect();
  dbInstance = mongoClient.db(process.env.DB_NAME);
};

export const GET_DB = () => {
  if (!dbInstance) {
    throw new Error("DB not connected");
  }

  return dbInstance;
};
