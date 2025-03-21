import * as dotenv from "dotenv";
import { connectToDataBase } from "./database";
import express from "express";
import cors from "cors";
import { employeeRouter } from "./employee.routes";

dotenv.config();

console.log("Environment variables:", process.env); // Debug line

const { ATLAS_URL } = process.env;
const baseURL = process.env.BASE_URL || "http://localhost";
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000; // Convert string to number

if (!ATLAS_URL) {
  console.error("Atlas URL is not present in environment variables");
  process.exit(1);
}

connectToDataBase(ATLAS_URL)
  .then(() => {
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use("/employees", employeeRouter);

    app.listen(port, "0.0.0.0", () => {
      console.log(`Server is running on ${baseURL}:${port}`);
    });
  })
  .catch((error) => console.error("Database connection error:", error));