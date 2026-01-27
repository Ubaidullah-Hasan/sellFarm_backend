import mongoose from "mongoose";
import config from "./config";
import { userServices } from "./app/modules/users/user.services";
import dotenv from "dotenv";
import path from "path";


dotenv.config({
  path: path.join(__dirname, "../.env"),
});

// for js
// const path = require("path");
// require("dotenv").config({
//   path: path.join(__dirname, "../.env"),
// });

(async () => {
  try {
    await mongoose.connect(config.database_url as string);

    const res = await userServices.addProfitToUserBalance();
    console.log("[CPANEL CRON PROFIT]", res);

    await mongoose.disconnect();
    process.exit(0);
  } catch (e) {
    console.error("[CPANEL CRON PROFIT ERROR]", e);
    process.exit(1);
  }
})();
