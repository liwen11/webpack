// 构建动态链接库文件

const path = require("path");
const { DllPlugin } = require("webpack");
module.exports = {
  mode: "development",
  entry: {
    react: ["react", "react-dom"] //! node_modules?
  },
  output: {
    path: path.resolve(__dirname, "./dll"),
    filename: "[name].dll.js",
    library: "react", // 输出的bundle对外以什么形式暴露
    // libraryTarget 
  },
  plugins: [
    new DllPlugin({
      // manifest.json⽂件的输出位置，此文件是给出.dll文件与webpack的映射
      path: path.join(__dirname, "./dll", "[name]-manifest.json"),
      // 定义打包的公共vendor⽂件对外暴露的函数名
      name: "react" // 这里的name值要和library名称一致
    })
  ]
};