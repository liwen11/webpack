// npx 指向node_modules下的webpack文件夹的bin 下面的webpack.js

// webpack配置就是一个对象
// webpack是基于nodeJs
const path = require('path')



module.exports = {
  context: process.cwd(), // 上下文 项目打包相对路径， 默认指向项目的根目录即：process.cwd()，必须是绝对路径
  entry: './src/index.js', // 打包构建的入口，是相对路径，相对于context路径
  output: { // 出口
    path: path.resolve(__dirname, './build'), // 构建的文件放在哪里，必须是绝对路径
    filename: 'index.js' // 构建的文件名称
  }
}