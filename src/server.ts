import { Server } from "http";
import app from "./app";
import config from "./config";
import mongoose from "mongoose";
import logger from "./app/utils/logger";

let server: Server;

async function main() {
  try {
    // await mongoose.connect(config.database_url as string);
    await mongoose.connect("mongodb://localhost:27017/new_my_db");
    logger.info("🛢️🛢️ Database connected successfully.");

    server = app.listen(config.port, () => {
      logger.info(`🚀🚀 URL: http://localhost:${config.port}`);
    });
  } catch (error) {
    logger.error(error);
  }
}

main();

process.on("unhandledRejection", (err) => {
  logger.error(`😈 unahandledRejection is detected , shutting down ...`, err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("uncaughtException", () => {
  logger.error(`😈 uncaughtException is detected , shutting down ...`);
  process.exit(1);
});


//SIGTERM
process.on('SIGTERM', () => {
  logger.info('SIGTERM IS RECEIVE');
  if (server) {
    server.close();
  }
});
