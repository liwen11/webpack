// 开发配置
const path = require("path");
const baseConfig = require('./webpack.config.base.js')

// "build": "webpack --config ./webpack.config.pro.js",
// 通过--config 指定webpack启动时走哪个配置文件，默认走webpack.config.js

const {merge} = require('webpack-merge');

const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack")

const devConfig = {
  mode: "development",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].js",
  },
  devtool: "cheap-inline-source-map",
  module: {
    rules: [
      {
        test: /\.less$/,
        include: path.resolve(__dirname, "./src"),
        use: [
          "style-loader",
          // MiniCssExtractPlugin.loader,// 对HMR支持不友好
          {
            loader: "css-loader",
            options: {
              //css modules 开启
              modules: true,
            },
          },
          {
            loader: "postcss-loader",
          },
          "less-loader",
        ],
      },
    ]
  },
  devServer: {
    //可以是相对路径
    contentBase: "./dist",
    open: true,
    hot: true, // 开启HMR
    hotOnly: true, // 即便HMR没有生效，浏览器也不要自动刷新
    proxy: {
      '/api': {
        target: 'http://localhost:9092'
      }
    },
    // 加载devServer中间件之前
    before(app, server) {
      app.get("/api/info", (req, res) => {
        res.json({
          hello: "express"
        })
      })
    },
    // 加载devServer中间件之后
    after() {},
    port: 8080,
  },
  plugins: [
    new HtmlWebpackPlugin({
      //选择html模板
      title: "首页",
      template: "./src/index.html",
      filename: "index.html"
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
}

module.exports = merge(baseConfig, devConfig)