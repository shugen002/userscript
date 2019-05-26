// ==UserScript==
// @name         BiliBili Live Room WebSocket Proxy
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include      /^https?:\/\/live\.bilibili\.com\/(blanc\/)?\d/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    if(window.DanmakuWebSocket){
        window.__DanmakuWebSocket=window.DanmakuWebSocket;
    }
    if(!window.BiliBiliOweMe300000 || !Array.isArray(window.BiliBiliOweMe300000)){
        window.BiliBiliOweMe300000=[]
    };
    Object.defineProperty(window,"DanmakuWebSocket",{
        set:function(value){
            var handler = {
                construct: function(target, args) {
                    args[0].__onReceivedMessage=args[0].onReceivedMessage;
                    args[0].onReceivedMessage=function(){
                        //console.log("received Messages:",arguments[0]);
                        if(!window.BiliBiliOweMe300000 || !Array.isArray(window.BiliBiliOweMe300000)){
                            window.BiliBiliOweMe300000=[]
                        };

                        if(window.BiliBiliOweMe300000.length>0){
                            for(let i=0;i<window.BiliBiliOweMe300000.length;i++){
                                
                                if(!window.BiliBiliOweMe300000[i](arguments[0])){return;}
                            }
                        }
                        args[0].__onReceivedMessage.apply(this,arguments)
                    }
                    var obj = Object.create(value.prototype);
                    this.apply(target, obj, args);
                    return obj;
                },
                apply: function(target, that, args) {
                    value.apply(that, args);
                }
            };
            return this.__DanmakuWebSocket=new Proxy(value,handler)},
        get:function(){return this.__DanmakuWebSocket}}
    )
})();
