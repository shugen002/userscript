// ==UserScript==
// @name         加大方形表情弹幕大小
// @version      0.1
// @namespace    https://shugen002.github.io/userscript
// @description  加大表情弹幕大小
// @license      WTFPL
// @author       Shugen002
// @match        https://live.bilibili.com/*
// @match        https://live.bilibili.com/blanc/*
// @exclude      https://live.bilibili.com/p/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    // 方形表情大小： 29 两行 48 三行
    const squareSize = 48;

    function replaceFunction(ptype) {
        if (!ptype.add) {
            console.log('[加大表情弹幕大小UserScript] 没有找到 add', window.location.href);
        } else {
            ptype._add = ptype.add
            ptype.add = function(...args){
                if(args[0].emojiRatio){
                    if(args[0].emojiRatio>0.9 && args[0].emojiRatio <1.1){
                        args[0].size = squareSize
                    }
                    if(args[0].html){
                       args[0].html = args[0].html.replace("@56h.webp","")
                    }
                    console.log(args[0])
                }
                return this._add(...args)
            };
            console.log('[加大表情弹幕大小UserScript] add 替换完成', window.location.href);
        }
    }

    function noUndefindErrorAllowed(obj, propertyName) {
        try {
            return obj.exports.default.prototype[propertyName]
        } catch (error) {
            return undefined;
        }
    }

    function findBase(prequire) {
        let level = 0;
        while (prequire) {
            for (const k in prequire.cache) {
                const cachedModule = prequire.cache[k];
                if (!!noUndefindErrorAllowed(cachedModule, 'loadDanmaku') && !!noUndefindErrorAllowed(cachedModule, 'add')) {
                    return cachedModule.exports.default.prototype;
                }
            }
            prequire = prequire.parent;
            level++;
        }
    }

    const ptype = findBase(window.parcelRequire);
    if (!ptype) {
        console.log('[加大表情弹幕大小UserScript] 没有找到 loadDanmaku 和 add 所在的 prototype', window.location.href);
    } else {
        replaceFunction(ptype);
    }

})();
