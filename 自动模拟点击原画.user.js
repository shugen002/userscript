// ==UserScript==
// @name         自动模拟点击原画
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  提高观众体验，顺带给破站增加亿点带宽成本
// @author       You
// @match        https://live.bilibili.com/*
// @match        https://live.bilibili.com/blanc/*
// @exclude      https://live.bilibili.com/p/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function(){
        let player=document.querySelector("#live-player")
        if(player){
            player.dispatchEvent(new MouseEvent("mousemove"))
            // console.log("move")
            setTimeout(function(){
                let quality=Array.from(document.getElementsByClassName("quality-wrap"))

                if(quality.length>0 && quality[0].textContent.trim()!="原画"){
                    quality[0].dispatchEvent(new MouseEvent("mouseenter"))
                    // console.log("enter")
                    setTimeout(function(){
                        let opts=Array.from(document.getElementsByClassName("quality-it"))
                        if(opts.length>1){
                            opts.forEach((e)=>{
                                if(e.textContent.trim()=="原画"){
                                    e.click()
                                    // console.log("click")
                                }
                            })
                        }

                    },100)
                }
            },200);
        }
    },2000)
    // Your code here...
})();
