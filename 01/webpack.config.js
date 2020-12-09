// npx 指向node_modules下的webpack文件夹的bin 下面的webpack.js

// webpack配置就是一个对象
// webpack是基于nodeJs
const path = require('path')
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  context: process.cwd(), // 上下文 项目打包相对路径， 默认指向项目的根目录即：process.cwd()，必须是绝对路径
  entry: './src/index.js', // 相当于对象的 entry: {main: './src/index.js'}
  // entry: ['./src/index.js', './src/other.js'], // 打包构建的入口，是相对路径，相对于context路径
  // entry: { // 多入口 需要对应多出口
  //   index: './src/index.js',
  //   other: './src/other.js'
  // },
  
  output: { // 出口
    path: path.resolve(__dirname, './build'), // 构建的文件放在哪里，必须是绝对路径
    // filename: 'index.js' // 构建的文件名称
    filename: '[name]-[hash:6].js' // name为占位符，多入口必须对应多出口，必须使用占位符
    // name 文件名称的占位符
    // hash 整个项目的hash值， 每构建一次就会有一个新的hash值，可指定长度，如：[hash:6]
    // chunkhash 根据不同入口entry进行依赖解析，构建对应的chunk，生成相应的hash,只要组成entry的模块没有内容改动，则对应的hash不变，有利于浏览器缓存
  
  },
  // 构建模式 
  // none 
  // production：默认值，正式环境，代码会被压缩优化，webpack会默认开启一些优化的插件； 
  // development: 开发环境，代码不会被压缩
  mode: 'development',
  module: { // 处理不认识的模块
    rules: [ // loader 模块转换
      {
        test: /\.css$/,
        // loader的执行顺序是从后往前
        // 先执行css-loader 把css模块内容加入到js模块中去 css in js方式
        // 后执行 style-loader 从js中提取css的loader内容，在html中创建style标签，把css的内容放在这个style标签中
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  // 插件
  plugins: [
    new CleanWebpackPlugin()
  ]
}