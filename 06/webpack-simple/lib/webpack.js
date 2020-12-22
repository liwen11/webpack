// 创建一个webpack
  // 1. 接收一份配置(webpack.config.js)
  // 2. 分析出入口模块位置
        // 读取入口模块的内容，分析内容
        // 哪些是依赖
        // 哪些是代码 es6,jsx, 处理 需要编译-> 浏览器能够执行
        // 分析其他模块
  // 3.拿到对象数据结构
        // 模块路径
        // 处理好的内容
  // 4.创建bundle.js
        // 启动器函数，来补充代码里有可能出现的module exports require, 
        // 让浏览器能够顺利的执行

const fs = require('fs')
const path = require('path')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default

const {transformFromAst} = require('@babel/core')

module.exports = class webpack {
  constructor(options) {
    const {entry, output} = options
    this.entry = entry
    this.output = output
    this.modules = []
  }
  run() {
    // 开始分析入口模块的内容
    const info = this.parse(this.entry)
    // console.log(info)
    // 递归分析其他的模块
    this.modules.push(info)
    for (let i = 0; i < this.modules.length; i++) {
      const item = this.modules[i]
      const {dependencies} = item
      if (dependencies) {
        for (let j in dependencies) {
          this.modules.push(this.parse(dependencies[j]))
        }
      } 
    }
    const obj = {}
    this.modules.forEach(item => {
      obj[item.entryFile] = {
        dependencies: item.dependencies,
        code: item.code
      }
    })
    console.log(obj)
    this.file(obj)
  }
  file(code) {
    // 创建自运行函数，处理require module exports
    // 生成main.js => dist/main.js
    const filePath = path.join(this.output.path, this.output.filename)
    console.log(filePath)
    // this.entry = './src/index.js'
    // reRequire 将./a.js 处理成 ./src/a.js, 因为code里面对象的key值为./src/a.js
    const newCode = JSON.stringify(code)
    const bundle = `(function(graph){
      function require(module) {
        function reRequire(relativePath) {
          return require(graph[module].dependencies[relativePath])
        }
        var exports = {};
        (function(require, exports, code) {
          eval(code)
        })(reRequire, exports, graph[module].code)
        return exports
      }
      require('${this.entry}')
    })(${newCode})`
    fs.writeFileSync(filePath, bundle, 'utf-8')
  }
  parse(entryFile) {
    
    const content = fs.readFileSync(entryFile, 'utf-8')
    const ast = parser.parse(content, {
      sourceType: 'module'
    })
    const dependencies = {}
    traverse(ast, {
      ImportDeclaration({node}) {
        // "./a.js" => "./src/a.js"
        const newPathName = path.join(path.dirname(entryFile), node.source.value)
        // console.log(newPathName)
        dependencies[node.source.value] = newPathName
      }
    })
    const {code} = transformFromAst(ast, null, {
      presets: ['@babel/preset-env']
    })
    // console.log(code)
    return {
      entryFile,
      dependencies,
      code
    }
  }
}