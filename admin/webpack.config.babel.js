import path from "path";
import webpack from "webpack";
import config from "../src/config";
import ExtractTextPlugin from "extract-text-webpack-plugin";

const extractCSS = new ExtractTextPlugin({ filename: "admin.bundle.css" });

export default {
  devtool: "cheap-module-eval-source-map", // more info:https://webpack.github.io/docs/build-performance.html#sourcemaps and https://webpack.github.io/docs/configuration.html#devtool
  target: "web", // necessary per https://webpack.github.io/docs/testing.html#compile-and-test
  node: {
    fs: "empty"
  },
  entry: "./admin/admin.js",
  output: {
    path: path.resolve(__dirname, "../public"),
    publicPath: "/",
    filename: "bundle.js"
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
    extractCSS
  ],
  module: {
    loaders: [
      {test: /\.js$/, include: path.join(__dirname), loaders: ["babel-loader"]},
      {
        test: /\.css$/,
        use: extractCSS.extract({
          use: ["css-loader"]
        })
      }
    ]
  },
  externals: {
    adminRouteUri: JSON.stringify(config.admin.uri) //eslint-disable-line
  }
};
