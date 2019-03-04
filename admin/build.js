require("babel-register");
require("dotenv").config();
const webpack = require("webpack");
const config = require("./webpack.config.babel.js").default;
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

config.plugins.push(new webpack.DefinePlugin({
  "process.env.ADMIN_PASSWORD_RESET_URI": process.env.ADMIN_PASSWORD_RESET_URI ? JSON.stringify(process.env.ADMIN_PASSWORD_RESET_URI) : JSON.stringify("/reset-password"),
  "process.env.ADMIN_ROUTE_URI": process.env.ADMIN_ROUTE_URI ? JSON.stringify(process.env.ADMIN_ROUTE_URI) : JSON.stringify("/admin"),
  "process.env.ADMIN_HOST": process.env.ADMIN_HOST ? JSON.stringify(process.env.ADMIN_HOST) : JSON.stringify("http://localhost:3000"),
}));

if (typeof process.env.NODE_ENV === "string" && process.env.NODE_ENV.toLowerCase() === "production") {
  config.plugins.push(new webpack.DefinePlugin({
    "process.env.NODE_ENV": JSON.stringify("production"),
  }));
  config.plugins.push(new UglifyJSPlugin());
  new webpack.HashedModuleIdsPlugin();
}

config.devtool = "source-map";

module.exports = new Promise((resolve, reject) => {
  webpack(config).run((err, stats) => {
    if (err) {
      return reject(err);
    }

    console.info(stats.toString(config)); // eslint-disable-line
    stats.toString({
      chunks: false, // Makes the build much quieter
      colors: true
    });

    return resolve("Admin JS bundle created");
  });
});
