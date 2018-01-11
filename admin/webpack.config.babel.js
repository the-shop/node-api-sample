import path from "path";
import webpack from "webpack";

export default {
  devtool: "cheap-module-eval-source-map", // more info:https://webpack.github.io/docs/build-performance.html#sourcemaps and https://webpack.github.io/docs/configuration.html#devtool
  target: "web", // necessary per https://webpack.github.io/docs/testing.html#compile-and-test
  entry: "./admin/admin.js",
  output: {
    path: path.resolve(__dirname, "../public"),
    publicPath: "/",
    filename: "bundle.js"
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
  module: {
    loaders: [
      {test: /\.js$/, include: path.join(__dirname), loaders: ["babel-loader"]},
    ]
  }
};
