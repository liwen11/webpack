module.exports = function(source, map, ast) {
  // loader 处理模块
  // 多个loader是有顺序的
  // 一定要有返回值
  // console.log(this, this.query, source)
  
  console.log(source)
  // const callback = this.async()
  // setTimeout(() => {
    const result = source.replace('ha', this.query.name)
    return result
    // callback(null, result)
  // }, 1000)
  
  
}