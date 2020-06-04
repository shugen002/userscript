// ==UserScript==
// @name         弹幕显示修复
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include      /^https?:\/\/live\.bilibili\.com\//
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    if(!window.BiliBiliOweMe300000 || !Array.isArray(window.BiliBiliOweMe300000)){
        window.BiliBiliOweMe300000=[]
    };
window.BiliBiliOweMe300000.push(function(a){if(a.cmd.split(":").length>1){var b=a.cmd.split(":");b[4]=0;a.cmd=b.join(":")};return true;})
    // Your code here...
})();