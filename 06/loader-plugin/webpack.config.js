const path = require("path");
const kkbLoader = require("./myLoaders/kkbLoader");
const kkbLoaderAsync = require("./myLoaders/kkbLoaderAsync");

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].js",
  },
  resolveLoader: {
    // 先去node_modules找，找不到后去myLoaders找
    modules: ['node_modules', './myLoaders']
  },
  module: {
    rules: [
      // {
      //   test: /\.js$/,
      //   use: [
      //     {
      //       loader: 'kkbLoader',
      //       options: {
      //         name: 'happy'
      //       }
      //     },
      //     {
      //       loader: 'kkbLoaderAsync',
      //       options: {
      //         name: '李雯'
      //       }
      //     }
      //   ]
      // },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'less-loader'
        ]
      }
    ],
  },
};
