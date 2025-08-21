import app from "./app.ts";
import config from "./config/index.ts";
import Logger from "./provider/logger.ts";
import Database from "./provider/mongodb.ts";
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
