// ==UserScript==
// @name         ForceAllowLive 强制B站直播允许第三方开播
// @namespace    https://shugen002.github.io/userscript
// @version      0.1
// @description  强制B站直播允许第三方开播
// @author       shugen
// @match        https://link.bilibili.com/p/center/index
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @run-at       document-start
// @license      WTFPL
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537331/ForceAllowLive%20%E5%BC%BA%E5%88%B6B%E7%AB%99%E7%9B%B4%E6%92%AD%E5%85%81%E8%AE%B8%E7%AC%AC%E4%B8%89%E6%96%B9%E5%BC%80%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/537331/ForceAllowLive%20%E5%BC%BA%E5%88%B6B%E7%AB%99%E7%9B%B4%E6%92%AD%E5%85%81%E8%AE%B8%E7%AC%AC%E4%B8%89%E6%96%B9%E5%BC%80%E6%92%AD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const myConsole = new Proxy(console, {
        get(target, prop) {
            if (prop === 'log' || prop === 'info' || prop === 'warn' || prop === 'error') {
                return function (...args) {
                    args.unshift("[ForceAllowLive]")
                    target[prop](...args);
                };
            }
            return target[prop];
        }
    });

    myConsole.log("Force Allow Live is running with document.readyState: " + document.readyState);

    let overrideBxios = false

    async function main() {
        injectWebpackJsonp()
    }

    function injectWebpackJsonp() {
        window.webpackJsonp = window.webpackJsonp || []
        window.webpackJsonp._push = window.webpackJsonp.push
        window.webpackJsonp.push = function (...args) {
            let apppack = args.find((pack) => {
                return pack[0].includes("vendors")
            })
            if (apppack) {
                InjectAppPack(apppack)
            }
            this._push(...args);
        }
        let apppack = window.webpackJsonp.find((e) => {
            return e[0] && e[0].includes("vendors")
        })
        if (apppack) {
            InjectAppPack(apppack)
        }
    }

    function InjectAppPack(pack) {
        myConsole.log('Get Vendor Pack')
        let entries = Object.entries(pack[1])
        let apiEntry = entries.find((entry) => {
            return entry[1].toString().includes("getAllResponseHeaders")
        })
        if (apiEntry) {
            myConsole.log('Get Bxios')
            apiEntry[1]._call = apiEntry[1].call
            apiEntry[1].call = function (...args) {
                let result = this._call(...args)
                let real = args[1].exports
                overrideBxios = true;
                myConsole.log('Bxios Get Overrided.')
                args[1].exports = function (...args) {
                    if (args[0].url == "//api.live.bilibili.com/room/v1/Room/startLive") {
                        args[0].data = args[0].data.replace("&platform=pc", "&platform=web")
                        myConsole.log("override start live request success.")
                    }
                    if (args[0].url == "//api.live.bilibili.com/xlive/app-blink/v1/live/GetWebLivePermission") {
                        let result = real(...args)
                        return result.then((e) => {
                            if (e.data && e.data) {
                                try {
                                    if (typeof e.data == 'string') {
                                        let res = JSON.parse(e.data)
                                        myConsole.info(`当前直播权限 ${res.data.allow_live} 粉丝数量要求 ${res.data.fans_threshold} 是否需要提示 ${res.data.need_notice}`)
                                        if (!res.data.allow_live && typeof res.data.allow_live == 'boolean') {
                                            res.data.allow_live = true;
                                        }
                                        e.data = JSON.stringify(res)
                                    } else {
                                        let res = e.data
                                        myConsole.info(`当前直播权限 ${res.data.allow_live} 粉丝数量要求 ${res.data.fans_threshold} 是否需要提示 ${res.data.need_notice}`)
                                        if (!res.data.allow_live && typeof res.data.allow_live == 'boolean') {
                                            res.data.allow_live = true;
                                        }
                                    }

                                } catch (error) {
                                    myConsole.error("GetWebLivePermission 后处理失败", error)
                                }
                            }
                            return e
                        })
                    }
                    let result = real(...args)
                    return result
                }
                return result
            }
        }
    }


    main().catch(e => {
        console.log("Force Allow Live Failed", e)
    })
    // Your code here...
})();