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
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

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
            console.log('[修改弹幕流基础件UserScript] onReceivedMessage 替换成功');
            return ptype.$$initialize(...args)
        }
        console.log(ptype)
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

                if (!!noUndefindErrorAllowed(cachedModule, 'initialize')&& !!noUndefindErrorAllowed(cachedModule, 'getAuthInfo')) {
                    return cachedModule.exports.prototype;
                }
            }
            prequire = prequire.parent;
            level++;
        }
    }
    var timeout;
    var count=0;
    function tick(){
            const ptype = findBase(window.parcelRequire);
    if (!ptype) {
        if(count>1000){
        console.log('[修改弹幕流基础件UserScript] 没有找到 initialize 和 getAuthInfo 所在的 prototype', window.location.href);
            clearInterval(timeout)
        }

    } else {
        replaceFunction(ptype);

        console.log('[修改弹幕流基础件UserScript] initialize 替换成功');
        clearInterval(timeout)
    }
    }
    timeout=setInterval(tick,10)
})();
