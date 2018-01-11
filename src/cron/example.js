import cron from "cron";
import debug from "debug";

const logMessage = debug("node-api-sample:cron:example:message");
const CronJob = cron.CronJob;

const example = new CronJob({
  cronTime: "00 * * * * *",
  onTick: async function () {
    logMessage("Example cron tick");
  },
  start: true,
  timeZone: "America/Los_Angeles"
});

export default {
  example
};
