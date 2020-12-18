const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack")

const PurifyCSS = require('purifycss-webpack')
const glob = require('glob-all')

// 压缩css
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = {
  entry: "./src/index.js",
  mode: "production",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].js",
  },
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
      {
        test: /\.(png|jpe?g|gif)$/,
        include: path.resolve(__dirname, "./src"),
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
        include: path.resolve(__dirname, "./src"),
        use: {
          loader: "babel-loader", // webpack和babel的通信桥梁，不会用于语法转换
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
    modules: [path.resolve(__dirname, "./node_modules")],
    alias: {
      // 减少查找过程
      // 起别名
      "@": path.resolve(__dirname, "./src/css"),
      // react: "./node_modules/react/umd/react.production.min.js",
      // "react-dom": "./node_modules/react-dom/umd/react-dom.production.min.js",
      // "react": "./node_modules/react/umd/react.production.min.js",
      // "react-dom": "./node_modules/react-dom/umd/react-dom.production.min.js"
    },
    extensions: [".js", ".json", ".jsx", ".ts", ".less"]
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
      app.get("/api/info", (req, res) => {
        res.json({
          hello: "express"
        })
      })
    },
    // 加载devServer中间件之后
    after() { },
    port: 8080,
  },
  externals: {
    //jquery通过script引⼊之后，全局中即有了 jQuery 变量
    // 'jquery': 'jQuery'
  },
  optimization: {
    usedExports: true, // 哪些导出的模块被使⽤了，再做打包
    splitChunks: {
      chunks: "all", // 所有的 chunks 代码公共的部分分离出来成为⼀个单独的⽂件
      automaticNameDelimiter: '-',
      cacheGroups: {
        lodash: {
          test: /lodash/,
          name: 'lodash'
        },
        react: {
          test: /react|react-dom/,
          name: 'react'
        }
      }
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
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
    new PurifyCSS({
      // 返回符合条件的路径模块
      paths: glob.sync([
        // 要做 CSS Tree Shaking 的路径⽂件
        path.resolve(__dirname, './src/*.html'), // 请注意，我们同样需要对 html ⽂件进⾏ tree shaking

        path.resolve(__dirname, './src/*.js')
      ])
    }),
    new HtmlWebpackPlugin({
      //选择html模板
      title: "首页",
      template: "./src/index.html",
      filename: "index.html",
      // minify: {
      //   // 压缩HTML⽂件
      //   removeComments: true, // 移除HTML中的注释
      //   collapseWhitespace: true, // 删除空⽩符与换⾏符
      //   minifyCSS: true // 压缩内联css
      // }
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
};
