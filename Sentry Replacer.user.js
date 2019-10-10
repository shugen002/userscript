// ==UserScript==
// @name         Sentry Replacer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @run-at       document-start
// @description  干掉Sentry,我玩啥关你屁事,请配合adblock之类工具屏蔽sentry脚本,欢迎大佬贡献实现不需要屏蔽
// @author       ShellTheWorld
// @match        *://*.bilibili.com/*
// @grant        unsafeWindow
// ==/UserScript==

(function() {
    'use strict';
    if(unsafeWindow.Sentry){
        console.log("maybe fail to replace and cause page crash");
    }
    function getEmptyItem(itemName){
        return new Proxy(function(){},{
            get:(target,name)=>{
                console.log(itemName+"."+name+" get");
                return getEmptyItem(itemName+"."+name);
            },
            set: function(obj, prop, value){
                console.log(itemName+"."+prop+" set ",value);
                return value;
            },
            apply:function(target, thisArg, argumentsList) {
                console.log(itemName+" apply ",thisArg,argumentsList);
                return getEmptyItem(itemName+"()");
            },
            construct:function(target, args){
                console.log(itemName+" apply ",args);
                return getEmptyItem("new "+itemName+"()");
            }
        })
    };
    unsafeWindow.Sentry=getEmptyItem("Sentry");
    Object.defineProperty(
        unsafeWindow,"Sentry",{
            set(value){
                return;
            },get(){
                return getEmptyItem("Sentry");
            }});
})();
