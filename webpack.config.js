import path from "path";
import webpack from "webpack";
import ExtractTextPlugin from "extract-text-webpack-plugin";

export default {
  devtool: "cheap-module-eval-source-map", // more info:https://webpack.github.io/docs/build-performance.html#sourcemaps and https://webpack.github.io/docs/configuration.html#devtool
  noInfo: true, // set to false to see a list of every file being bundled.
  quiet: true,
  target: "node",
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin("styles.css")
  ],
  stats: {
    colors: true
  },
  module: {
    loaders: [
      {test: /\.js$/, include: path.join(__dirname, "web"), loaders: ["babel"], exclude: "/node_modules/"},
      {test: /\.js$/, include: path.join(__dirname, "api"), loaders: ["babel"], exclude: "/node_modules/"},
      {test: /\.js$/, include: path.join(__dirname, "common"), loaders: ["babel"], exclude: "/node_modules/"},
      {test: /.eot(\?v=\d+.\d+.\d+)?$/, loader: "file", exclude: "/node_modules/"},
      {test: /.(woff|woff2)$/, loader: "file-loader?prefix=font/&limit=5000", exclude: "/node_modules/"},
      {test: /.ttf(\?v=\d+.\d+.\d+)?$/, loader: "file-loader?limit=10000&mimetype=application/octet-stream", exclude: "/node_modules/"},
      {test: /.svg(\?v=\d+.\d+.\d+)?$/, loader: "file-loader?limit=10000&mimetype=image/svg+xml", exclude: "/node_modules/"},
      {test: /\.(jpe?g|png|gif)$/i, loaders: ["file"], exclude: "/node_modules/"},
      {test: /\.ico$/, loader: "file-loader?name=[name].[ext]", exclude: "/node_modules/"},
      {test: /\.json$/, loader: "js", exclude: "/node_modules/"},
      {
        test: /(\.css|\.scss|\.sass|\.less)$/,
        loader: ExtractTextPlugin.extract("css-loader?sourceMap!sass-loader?sourceMap!less-loader?sourceMap"),
        exclude: "/node_modules/"
      }
    ],
    noParse: [ "ws" ]
  },
  externals: [ "ws" ]
};
