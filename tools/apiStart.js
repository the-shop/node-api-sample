/**
 * This is entry for API so that NewRelic startup goes correctly
 */
require("dotenv").config();
require("newrelic");
const express = require("express");
const Application = require("../src/Application").default;

const app = new Application();

process.on("unhandledRejection", (reason, promise) => {
  app.logError("Unhandled Rejection at: %O", promise);
  app.logError("Unhandled Rejection reason: %O", reason);
});

app.setExpress(express());
app.run();
