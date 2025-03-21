import * as dotenv from "dotenv";
import { connectToDataBase } from "./database";
import express from "express";
import cors from "cors";
import { employeeRouter } from "./employee.routes";

dotenv.config();

const { ATLAS_URL } = process.env;
const baseURL = process.env.BASE_URL || "http://localhost"; // Default to localhost if not specified in .env
const port = process.env.PORT || 3000; // Default to 3000 if not specified in .env

if (!ATLAS_URL) {
  console.error("Atlas URL is not present in dotenv");
  process.exit(1);
}

connectToDataBase(ATLAS_URL)
  .then(() => {
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use('/employees', employeeRouter);
    
    app.listen(port, () => {
      console.log(`Server is running on ${baseURL}:${port}`);
    });
  })
  .catch((error) => console.error(error));