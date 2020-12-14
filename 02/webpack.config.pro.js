// 生产配置
const path = require("path");
const baseConfig = require('./webpack.config.base.js')
// 通过--config 指定webpack启动时走哪个配置文件，默认走webpack.config.js
const {merge} = require('webpack-merge')

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 压缩css
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const proConfig = {
  output: {
    path: path.resolve(__dirname, "./build"),
    filename: "[name].js",
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.css$/,
        include: path.resolve(__dirname, "./src"),
        // include // 只去这里查找。推荐只用include去src下查找
        // exclude 不去这里查找
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.less$/,
        include: path.resolve(__dirname, "./src"),
        use: [
          // "style-loader",
          MiniCssExtractPlugin.loader,// 对HMR支持不友好
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
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name]-[contenthash:8].css",
    }),
    new OptimizeCSSAssetsPlugin({
      // cssnano是postcss的依赖，因此安装了postcss后不需要再安装cssano 
      cssProcessor: require("cssnano"), //引⼊cssnano配置压缩选项
      cssProcessorOptions: {
      discardComments: { removeAll: true }
      }
    }),
    new HtmlWebpackPlugin({
      //选择html模板
      title: "首页",
      template: "./src/index.html",
      filename: "index.html",
      minify: {
        // 压缩HTML⽂件
        removeComments: true, // 移除HTML中的注释
        collapseWhitespace: true, // 删除空⽩符与换⾏符
        minifyCSS: true // 压缩内联css
      }
    }),
  ],
}

module.exports = merge(baseConfig, proConfig)