import app from "./app";
import config from "./config/index";
import Logger from "./provider/logger";
import Database from "./provider/mongodb";
import "reflect-metadata";

const { APP_CONFIG } = config;
const PORT = APP_CONFIG.PORT;

const main = async () => {
  await Database.getInstance();

  app.listen(PORT, () => {
    Logger.info("Server", `🚀 Server listening on http://localhost:${PORT}`);
  });
};
main();
