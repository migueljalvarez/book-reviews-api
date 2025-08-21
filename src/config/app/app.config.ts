import dotenv from "dotenv";
dotenv.config({});
const { PORT, OPEN_LIBRARY } = process.env;
export const APP_CONFIG = {
  PORT: PORT || 3000,
  OPEN_LIBRARY: OPEN_LIBRARY || "",
};
