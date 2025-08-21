import dotenv from "dotenv";
dotenv.config({});
const { MONGO_URI, MONGO_DB_NAME } = process.env;
export const DB_CONFIG = {
  MONGO_URI: MONGO_URI || "",
  MONGO_DB_NAME,
};
