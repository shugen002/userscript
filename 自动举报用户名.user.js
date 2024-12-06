// ==UserScript==
// @name         自动举报用户名
// @namespace    https://shugen002.github.io/userscript
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://live.bilibili.com/*
// @match        https://live.bilibili.com/blanc/*
// @exclude      https://live.bilibili.com/p/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    if(!window.$$danmuPatcher){
        window.$$danmuPatcher=[]
    }
    // 数字的n种写法
    const numMap={
        "0": "[0oO零]",
        "1": "[1l一壹]",
        "2": "[2二贰]",
        "3": "[3౩꒱三叁]",
        "4": "[4四肆]",
        "5": "[5五伍]",
        "6": "[6Ⳓნେ六陆]",
        "7": "(𖩈|[7˥ꓶ七柒])",
        "8": "(𐌚|[ଃ8ꯕ႘੪八捌])",
        "9": "[9୨九玖]"
    }

    
    var filters=[]
    var excludeFilter=[]
    window.$$reported=[]
    // 纯数字的联系方式可以放这里自动生成匹配 加完后大概就这样 var matchNumber=[12345678,12235]
    var matchNumber=[] // 
    var badword=[
        /.*?([Rr][Ee][Nn]|[秂朲魜])([Qq][Ii]|[気芞柒乞氣]).*/, // 人气的n种写法
        /.*?(独家|直播|刷)人气.*/,
        /.*?人气bili.*/,
    ]
    var contactMethod=[
        ...matchNumber.map((e)=>{
            return new RegExp(e.toString().split("").map((e)=>{return numMap[e]||e}).join("[^\d]*"))
        }),
        //你也可以在这里塞入你的正则表达式 
    ]
    var exclude=[
        /^\d*$/,
        /^bili_\d*$/,
        /^\d*_bili$/
    ]
    window.$$lastwelcome=[]
    function handle(e){
        if(e.cmd=="INTERACT_WORD"){
            if(typeof e.data.uname=="string"){
                let uname=e.data.uname
                let uid=e.data.uid
                // console.log(uname,uid)
                window.$$lastwelcome.push([uname,uid])
                window.$$lastwelcome=window.$$lastwelcome.slice(-10)
                let isbad=filters.some((e)=>{
                    return e(uname)
                })
                if(!isbad){
                    return
                }
                let isExclude=excludeFilter.some((e)=>{
                    return e(uname)
                })
                if(isExclude){
                    return
                }
                if(window.$$reported.indexOf(uid)==-1){
                    window.$$reported.push(uid);
                    report(uid,uname)
                }
            }
        }
    }
    function report(uid,uname){
        // if(!confirm(`举报${uname},${uid}`)){return}
        fetch("https://space.bilibili.com/ajax/report/add", {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "content-type": "application/x-www-form-urlencoded",
            },
            "body": `mid=${uid}&reason=2&reason_v2=3&csrf=${document.cookie.match(/(?<=bili_jct\=).{32}/)[0]}`,
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        }).then((e)=>e.json()).then((e)=>{console.log(uname,uid,e)}).catch(()=>{});
    }
    filters.push(function(e){
        return badword.some((w)=>{
            return e.match(w)!=null;
        })
    })
    filters.push(function(e){
        return contactMethod.some((w)=>{
            return e.match(w)!=null;
        })
    })
    excludeFilter.push(function(e){
        return exclude.some((w)=>{
            return e.match(w)!=null;
        })
    })
    window.$$danmuPatcher.push(handle)

    // Your code here...
})();
