import debug from "debug";
import fs from "fs";
import { join } from "path";
import Database from "../src/Database/Database";

const logMessage = debug("node-api-sample:cron:start:message");

logMessage("Connecting to Mongo");
const database = new Database({ keepAlive: true });
database.connect();

logMessage("Bootstrapping models for cron");
const servicesDir = join(__dirname, "../src/Services");

fs.readdirSync(servicesDir)
// Filter out .js files in Services directory
  .filter(one => one.match(/^(.(?!\.js$))+$/))
  .forEach(dirName => {
    const serviceModelsDirectoryPath = join(servicesDir, dirName, "Models");
    // Check if "Models" directory exists
    if (fs.existsSync(serviceModelsDirectoryPath)) {
      fs.readdirSync(serviceModelsDirectoryPath)
        .forEach(file => {
          require(join(serviceModelsDirectoryPath, file));
        });
    }
  });

logMessage("Starting cron jobs");
const jobs = join(__dirname, "../src/cron");
fs.readdirSync(jobs)
  .filter(file => ~file.indexOf(".js"))
  .forEach(file => {
    logMessage("Starting cron jobs defined in: '%s'", file);
    const cronJobs = require(join(jobs, file)).default;
    Object.keys(cronJobs).forEach(jobName => {
      logMessage("Starting job: '%s:%s'", file, jobName);
      cronJobs[jobName].start();
    });
  });
