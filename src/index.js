import "dotenv/config";
import express from "express";
import cors from "cors";
import getPublicationData from "./spm-scraper";
import { MOCK_DATA } from "./mock-data";

const PAGE_TO_CHECK = 29;
const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send(MOCK_DATA);
  // USE BELOW WHEN GO LIVE, USE MOCK WHEN DEVELOPING
  //   getPublicationData(PAGE_TO_CHECK).then(p => res.send(p));
});

app.listen(process.env.PORT, () =>
  console.log(`SPM-Scraper listening on port ${process.env.PORT}!`)
);
