/* eslint-disable no-console */
// =>>>> use kori nai karon cpanel e kaj kore na (cPanel e cron setup korsi)

import cron from "node-cron";
import { userServices } from "../modules/users/user.services";

export const startProfitCron = () => {
  // রাত 12:05 AM (Dhaka) - safer than exact 12:00 => "5 0 * * *"
  cron.schedule(
    // "5 0 * * *",
     "*/30 * * * * *", // ⭐ এটা 30 সেকেন্ড পরপর চলবে
    async () => { 
      try {
        const res = await userServices.addProfitToUserBalance();
        console.log("[PROFIT CRON]", res);
      } catch (e) {
        console.error("[PROFIT CRON ERROR]", e);
      }
    },
    { timezone: "Asia/Dhaka" }
  );
};
