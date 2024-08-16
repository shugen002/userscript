// ==UserScript==
// @name         淘宝隐藏收货地
// @namespace    http://tampermonkey.net/
// @version      2024-03-12
// @description  try to take over the world!
// @author       You
// @match        https://item.taobao.com/*
// @match        https://detail.tmall.com/item.htm*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=taobao.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var a= document.createElement("style");
    a.innerText=`.delivery-content-inner>.select-trigger { opacity: 0% }
    .delivery-content-inner>.select-trigger:hover { opacity: 100% }
    .Address--select-trigger--1aMBLQY{ opacity: 0% }
    .Address--select-trigger--1aMBLQY:hover { opacity: 100% }
    `
    document.body.appendChild(a)
    // Your code here...
})();