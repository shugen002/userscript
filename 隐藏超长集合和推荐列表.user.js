// ==UserScript==
// @name         隐藏超长集合和推荐列表
// @namespace    https://shugen002.github.io/userscript
// @version      2024-01-14
// @description  try to take over the world!
// @author       Shugen
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var a= document.createElement("style");
    a.innerText=`div.video-pod.video-pod {
  max-height: 600px;
  overflow-y: scroll;
}

.rec-list {
  max-height: 500px;
  /* 初始最大高度 */
  overflow: hidden;
  /* 超出隐藏 */
  transition: max-height 0.3s ease;
  /* 添加过渡效果 */
}

.recommend-list-v1:hover>.rec-list {
  max-height: unset;
  /* 初始最大高度 */
}
    `
    document.body.appendChild(a)
    // Your code here...
})();
