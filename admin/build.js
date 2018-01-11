require("babel-register");
const webpack = require("webpack");
const config = require("./webpack.config.babel.js").default;

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
