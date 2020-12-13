const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack')

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        include: path.resolve(__dirname, './src'),
        // include // 只去这里查找。推荐只用include去src下查找
        // exclude 不去这里查找
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.less$/,
        include: path.resolve(__dirname, './src'),
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
      {
        test: /\.(png|jpe?g|gif)$/,
        include: path.resolve(__dirname, './src'),
        use: {
          loader: "url-loader",
          options: {
            name: "[name]_[hash:6].[ext]",
            outputPath: "images/",
            //推荐使用url-loader 因为url-loader支持limit
            //推荐小体积的图片资源转成base64
            limit: 12 * 1024, //单位是字节 1024=1kb
          },
        },
      },
      {
        test: /\.js$/,
        // exclude: /node_modules/,
        include: path.resolve(__dirname, './src'),
        use: {
          loader: 'babel-loader', // webpack和babel的通信桥梁，不会用于语法转换
          // options: {
          //   // 语法转换插件preset-env
          //   presets: [
          //     [
          //       '@babel/preset-env',
          //       { // 对preset-env的传参
          //         targets: {
          //           edge: "17",
          //           firefox: "60",
          //           chrome: "67",
          //           safari: "11.1"
          //         },
          //         corejs: 2,//新版本需要指定核⼼库版本
          //         // promise 不能经过babel转换，浏览器不认识怎么办？
          //         // 提前引进polyfill -> 垫片 ES6+的ECMA规范库
          //         // 我们此处只用了promise，而polyfill垫片中包含了所有的es6+规范如async,await等，会导致我们打包后的js文件变的很大
          //         // 因此，我们需要给垫片瘦身，实现按需加载减少冗余
          //         useBuiltIns: "usage"//按需注⼊，                
          //       }
          //     ],
          //     '@babel/preset-react'
          //   ]
          // }
        }
      }
    ],
  },
  resolve: {
    // 查找第三方依赖
    modules: [path.resolve(__dirname, './mode_modules')],
    alias:{
      // 减少查找过程
      // 起别名
      "@": path.resolve(__dirname, './src/css'),
      react: './node_modules/react/umd/react.production.min.js',
      'react-dom': './node_modules/react-dom/umd/react-dom.production.min.js'
    },
    extensions:['.js','.json','.jsx','.ts', '.less']
  },
  devtool: "cheap-inline-source-map",
  devServer: {
    //可以是相对路径
    contentBase: "./dist",
    open: true,
    hot: true, // 开启HMR
    hotOnly: true, // 即便HMR没有生效，浏览器也不要自动刷新
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:9092'
    //   }
    // },
    // 加载devServer中间件之前
    before(app, server) {
      app.get('/api/info', (req, res) => {
        res.json({
          hello: 'express'
        })
      })
    },
    // 加载devServer中间件之后
    after() {},
    port: 8080,
  },
  externals: {
    //jquery通过script引⼊之后，全局中即有了 jQuery 变量
    // 'jquery': 'jQuery'
  },
  plugins: [
    new CleanWebpackPlugin(),
    // new MiniCssExtractPlugin({
    //   filename: "css/[name].css",
    // }),
    new HtmlWebpackPlugin({
      //选择html模板
      title: "首页",
      template: "./src/index.html",
      filename: "index.html",
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
};
