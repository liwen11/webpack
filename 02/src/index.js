import str from './hello'

// import _ from "lodash";
// console.log(_.join(['a','b','c','****']))

import React, { Component } from "react";
import ReactDom from "react-dom";
class App extends Component {
  render() {
    return <div>hello world</div>;
  }
}
ReactDom.render(<App />,
  document.getElementById("root"));
// import {add} from './expo'
// add(1, 2)


// import css from "./css/index.less";

// import axios from 'axios'
// axios.get('/api/info').then(res => {
//   console.log(res)
// })

// import pic from "./images/logo.png";
// console.log("css");

// let ele = `<div class=${css.ele}>css module</div>`;

// var img = new Image();
//图片的路径 pic
// img.src = pic;
// var root = document.getElementById("root");
// root.append(img);

// document.write(ele);
// console.log(css, css.toString());

// var btn = document.createElement("button");
// btn.innerHTML = "新增";
// document.body.appendChild(btn);
// btn.onclick = function () {
//   var div = document.createElement("div");
//   div.innerHTML = "item";
//   document.body.appendChild(div);
// };

// import counter from "./counter";
// import number from "./number";
// counter();
// number();
// if (module.hot) { // 如果开启了HMR,module.hot就会为true
//   module.hot.accept("./number.js", function () { // 如果监测的文件内容变化，则回调会被执行
//     document.body.removeChild(document.getElementById("number"));
//     number();
//   });
// }

// import '@babel/polyfill';
// const arr = [new Promise(() => { }), new Promise(() => { })];
// arr.map(item => {
//   console.log(item);
// });
// promise 不能经过babel转换，浏览器不认识怎么办？
// 提前引进polyfill -> 垫片 ES6+的ECMA规范库
// 我们此处只用了promise，而polyfill垫片中包含了所有的es6+规范如async,await等，会导致我们打包后的js文件变的很大
// 因此，我们需要给垫片瘦身，实现按需加载减少冗余

// import jquery from 'jquery'
