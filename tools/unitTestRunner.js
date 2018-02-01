import path from "path";
import fs from "fs";
import { join } from "path";
import express from "express";
import Application from "../src/Application";
import Database from "../src/Database/Database";
import AbstractListener from "../src/Framework/AbstractListener";
import config from "../src/config";

const app = new Application();
app.setExpress(express())
  .setConfiguration(config)
  .bootstrap();

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at: %O", promise); // eslint-disable-line
  console.error("Unhandled Rejection reason: %O", reason); // eslint-disable-line
});

class RunTests extends AbstractListener {
  /**
   * Array of event string identifiers
   *
   * @type {Array}
   */
  static LISTEN_ON = [
    Database.DATABASE_CONNECTION_CONNECTED
  ];

  runAllTests(directory, baseDirectory = true) {
    let dirContent = fs.readdirSync(directory);
    if (baseDirectory) {
      // Filter out .js files in root of `test/` directory - contains reusable components
      dirContent = dirContent
        .filter(one => one.match(/^(.(?!\.js$))+$/));
    }
    dirContent.forEach(dirNameOrFileName => {
      const path = join(directory, dirNameOrFileName);
      const stat = fs.lstatSync(path);
      if (stat && stat.isDirectory()) {
        this.runAllTests(path, false);
      } else {
        this.runSingleTest(path);
      }
    });
  }

  runSingleTest (testFilePath) {
    this.getApplication().log("Running %s/%s", testFilePath);
    const className = require(testFilePath).default;
    const instance = new className(app);
    instance.express = app.express;
    if (typeof instance.run === "function") {
      instance.run();
    }
  }

  /**
   * Listener entry point
   */
  async handle () {
    // Let's drop database as soon as application is ready
    await this.getApplication()
      .getDatabase()
      .drop();

    this.runAllTests(path.join(__dirname, "../test"), true);
  }
}

const runListener = new RunTests();
runListener.setApplication(app);

app.getEventsRegistry().listen(Database.DATABASE_CONNECTION_CONNECTED, runListener);

app.run();
