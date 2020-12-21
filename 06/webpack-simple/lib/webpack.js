const fs = require('fs')
const path = require('path')
const parser = require('@babel/parser')
const { PassThrough } = require('stream')
const traverse = require('@babel/traverse').default

module.exports = class webpack {
  constructor(options) {
    const {entry, output} = options
    this.entry = entry
    this.output = output
  }
  run() {
    this.parse(this.entry)
  }
  parse(entryFile) {
    // 开始分析入口模块的内容
    const content = fs.readFileSync(entryFile, 'utf-8')
    const ast = parser.parse(content, {
      sourceType: 'module'
    })
    const dependencies = {}
    traverse(ast, {
      ImportDeclaration({node}) {
        // "./a.js" => "./src/a.js"
        const newPathName = path.join(path.dirname(entryFile), node.source.value)
        console.log(newPathName)
        dependencies[node.source.value] = newPathName
      }
    })
    console.log(dependencies)
  }
}