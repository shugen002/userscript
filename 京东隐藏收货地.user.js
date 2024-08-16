// ==UserScript==
// @name         京东隐藏收货地
// @namespace    http://tampermonkey.net/
// @version      2024-08-07
// @description  try to take over the world!
// @author       You
// @match        https://item.jd.com/*.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jd.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var a= document.createElement("style");
    a.innerText=`.stock-address> div > div.ui-area-text-wrap > div { opacity: 0% }
    .stock-address> div > div.ui-area-text-wrap > div:hover { opacity: 100% }
    `
    document.body.appendChild(a)
})();