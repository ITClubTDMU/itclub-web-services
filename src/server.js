import "dotenv/config";

import express from "express";
import { CONNECT_DB, GET_DB } from "./config/mongodb";

const START_SERVER = () => {
  const app = express();

  const hostname = "localhost";
  const port = 8017;

  app.get("/", async (req, res) => {
    // Test Absolute import mapOrder
    console.log(await GET_DB().listCollections().toArray());
    res.end("<h1>Hello World!</h1><hr>");
  });

  app.listen(port, hostname, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is running at http://${hostname}:${port}/`);
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
