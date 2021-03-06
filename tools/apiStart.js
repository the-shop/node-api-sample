/**
 * This is entry for API 
 */
require("dotenv").config();
const express = require("express");
const config = require("../src/config").default;
const Application = require("../src/Application").default;

const app = new Application();

process.on("unhandledRejection", (reason, promise) => {
  app.logError("Unhandled Rejection at: %O", promise);
  app.logError("Unhandled Rejection reason: %O", reason);
});

app.setExpress(express())
  .setConfiguration(config)
  .bootstrap()
  .run();
