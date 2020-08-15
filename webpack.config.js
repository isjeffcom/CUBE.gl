const path = require("path");
module.exports = {
  mode: "production",
  entry: "./src/Main.js",
  output: {
    path: path.resolve(__dirname, "./build"),
    filename: "cube_npm.js",
    libraryTarget: "umd",
    globalObject: "this",
    library: "webpackNumbers"
  },
  optimization: {
      minimize: true
  }
}