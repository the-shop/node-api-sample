import debug from "debug";
import Promise from "bluebird";
import fs from "fs";
import { join } from "path";
import Database from "./Database";

const logMessage = debug("engage:seedRunner:message");
const logError = debug("engage:seedRunner:error");

const runCommands = [];

const availableCommands = ["seed"];

const renderMalformedInputError = () => {
  logError("Available commands: %O", availableCommands);
  throw new Error("Command not recognized. Run script in form of `npm run databse <COMMAND>`.");
};

const renderMalformedRunnerError = (runner) => {
  logError("Runner `%s` didn't export mandatory property `run`", runner);
  throw new Error("Please update your command");
};

process.argv.forEach(function (val) {
  if (availableCommands.indexOf(val) > -1) {
    logMessage("Registered command: %s", val);
    runCommands.push(val);
  }
});

if (runCommands.length === 0) {
  renderMalformedInputError();
}

logMessage("Creating new Mongo connection.");
const database = new Database({ keepAlive: false });
database.connect();

logMessage("Bootstrapping models");
const servicesDir = join(__dirname, "../Services");
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

const runners = [];

const callRunners = (command) => {
  const commands = join(__dirname, "./", command);
  fs.readdirSync(commands)
    .sort((command1, command2) => command1 > command2)
    .filter(file => ~file.indexOf(".js"))
    .forEach(file => {
      logMessage("%s: %s", command, file);
      const runner = require(join(commands, file)).default;
      if (runner && typeof runner.run === "function") {
        runners.push(runner.run());
      } else {
        renderMalformedRunnerError(file);
      }
    });
};

for (const one of runCommands) {
  callRunners(one);
}

Promise.all(runners).then(() => {
  logMessage("Disconnect from Mongo");
  database.disconnect();
});
