import * as dotenv from "dotenv";
import { connectToDataBase } from "./database";
import express from "express";
import cors from "cors";
import { employeeRouter } from "./employee.routes";

dotenv.config();

const { ATLAS_URL } = process.env;

if (!ATLAS_URL) {
  console.error("Atlas URL is not present in dotenv");
  process.exit(1);
}

connectToDataBase(ATLAS_URL)
  .then(() => {
    const app = express();
    app.use(cors());
    app.use(express.json())
    app.use('/employees',employeeRouter)
    app.listen(3000, () => {
      console.log(`Server is running on port 3000`);
    });
  })
  .catch((error) => console.error(error));