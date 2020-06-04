// ==UserScript==
// @name         All Log
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include      /^https?:\/\/live\.bilibili\.com\//
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    if(!window.BiliBiliOweMe300000 || !Array.isArray(window.BiliBiliOweMe300000)){
        window.BiliBiliOweMe300000=[]
    };
    function check(data){
            window.console.log(data);
        return true
    }
    window.BiliBiliOweMe300000.push(check)
    // Your code here...
})();