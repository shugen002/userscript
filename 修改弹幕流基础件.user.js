// ==UserScript==
// @name         修改弹幕流基础件
// @version      0.1
// @namespace    https://shugen002.github.io/userscript
// @description  修改直播弹幕流基础件
// @license      MIT
// @author       Shugen002
// @match        https://live.bilibili.com/*
// @match        https://live.bilibili.com/blanc/*
// @exclude      https://live.bilibili.com/p/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    const squareSize = 48;

    function replaceFunction(ptype) {
        ptype.$$initialize=ptype.initialize
        ptype.initialize=function(...args){
            args[0].$$onReceivedMessage = args[0].onReceivedMessage
            args[0].onReceivedMessage = function (...args2){
                if(window.$$danmuPatcher){
                    try{
                        window.$$danmuPatcher.forEach((e)=>{
                            e(...args2)
                        })
                    }catch(e){
                        console.error("执行修改时出现错误",e)
                    }
                }
                return this.$$onReceivedMessage(...args2)
            }
            return ptype.$$initialize(...args)
        }
    }

    function noUndefindErrorAllowed(obj, propertyName) {
        try {
            return obj.exports.prototype[propertyName]
        } catch (error) {
            return undefined;
        }
    }

    function findBase(prequire) {
        let level = 0;
        while (prequire) {
            for (const k in prequire.cache) {
                const cachedModule = prequire.cache[k];
                if (!!noUndefindErrorAllowed(cachedModule, 'getReturn') && !!noUndefindErrorAllowed(cachedModule, 'getRetryCount')) {
                    return cachedModule.exports.prototype;
                }
            }
            prequire = prequire.parent;
            level++;
        }
    }

    const ptype = findBase(window.parcelRequire);
    if (!ptype) {
        console.log('[加大表情弹幕大小UserScript] 没有找到 getReturn 和 getRetryCount 所在的 prototype', window.location.href);
    } else {
        replaceFunction(ptype);
    }
})();
