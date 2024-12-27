import express from "express";
import cors from "cors";
import { CONNECT_DB, GET_DB } from "./config/mongodb";
import { env } from "./config/environment";
import { errorHandlingMiddleware } from "./middlewares/errorHandlingMiddleware";
import APIs_V1 from "./routes/v1";
import { corsOptions } from "./config/cors";

const START_SERVER = () => {
  const app = express();

  app.use(express.json());

  app.use(cors(corsOptions));

  app.get("/", async (req, res) => {
    // Test Absolute import mapOrder
    console.log(await GET_DB().listCollections().toArray());
    res.end("<h1>Hello World!</h1><hr>");
  });

  app.use("/v1", APIs_V1);

  app.use(errorHandlingMiddleware);

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is running at http://${env.APP_HOST}:${env.APP_PORT}/`);
  });
};

CONNECT_DB()
  .then(() => {
    console.log("Connected to MongoDB");
    START_SERVER();
  })
  .catch((err) => {
    console.error(err);
    process.exit(0);
  });
