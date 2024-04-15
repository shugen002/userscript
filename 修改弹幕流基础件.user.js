// ==UserScript==
// @name         修改弹幕流基础件
// @version      0.3
// @namespace    https://shugen002.github.io/userscript
// @description  修改直播弹幕流基础件
// @license      MIT
// @author       Shugen002
// @match        https://live.bilibili.com/*
// @match        https://live.bilibili.com/blanc/*
// @exclude      https://live.bilibili.com/p/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @updateURL    https://github.com/shugen002/userscript/raw/master/%E4%BF%AE%E6%94%B9%E5%BC%B9%E5%B9%95%E6%B5%81%E5%9F%BA%E7%A1%80%E4%BB%B6.user.js
// @downloadURL  https://github.com/shugen002/userscript/raw/master/%E4%BF%AE%E6%94%B9%E5%BC%B9%E5%B9%95%E6%B5%81%E5%9F%BA%E7%A1%80%E4%BB%B6.user.js
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    window.__GREAT_TOILET__ = function (item){
        if(window.$$danmuPatcher){
            try{
                window.$$danmuPatcher.forEach((e)=>{
                    e(item)
                })
            }catch(e){
                console.error("执行修改时出现错误",e)
            }
        }

    }
    return;
})();
