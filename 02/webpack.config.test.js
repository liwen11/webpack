const baseConfig = require('./webpack.config.base.js')
const devConfig = require('./webpack.config.dev.js')
const proConfig = require('./webpack.config.pro.js')
const {merge} = require('webpack-merge')

console.log(process.env.NODE_ENV)

// "test": "webpack --env.production --config ./webpack.config.test.js"
// 这个命令会将env.production传入下面的module.exports 即 env = {production: true}

module.exports = (env) => {
  console.log('4444:' + env)
  // 如果外部传进env.production是生产
  // 如果外部没有传进就是开发
  if (process.env.NODE_ENV == 'test') {
    return merge(baseConfig, proConfig)
  } else {
    return merge(baseConfig, devConfig)
  }
}