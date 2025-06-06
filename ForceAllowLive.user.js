// ==UserScript==
// @name         ForceAllowLive 强制B站直播允许第三方开播
// @namespace    https://shugen002.github.io/userscript
// @version      0.3
// @description  强制B站直播允许第三方开播，顺带处理人脸识别无二维码的问题。
// @author       shugen
// @match        https://link.bilibili.com/p/center/index
// @match        https://link.bilibili.com/p/center/index?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @run-at       document-start
// @license      WTFPL
// @grant        none
// @downloadURL  https://update.greasyfork.org/scripts/537331/ForceAllowLive%20%E5%BC%BA%E5%88%B6B%E7%AB%99%E7%9B%B4%E6%92%AD%E5%85%81%E8%AE%B8%E7%AC%AC%E4%B8%89%E6%96%B9%E5%BC%80%E6%92%AD.user.js
// @updateURL    https://update.greasyfork.org/scripts/537331/ForceAllowLive%20%E5%BC%BA%E5%88%B6B%E7%AB%99%E7%9B%B4%E6%92%AD%E5%85%81%E8%AE%B8%E7%AC%AC%E4%B8%89%E6%96%B9%E5%BC%80%E6%92%AD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 你们怕我盗号什么的，还去找B站官方问的，你们最好祈祷叔叔啥都顺着你的意思走。

    // 如果你非要找人去审查代码，请不要找 B 站官方或运营或技术，找其他非B站员工的技术大佬

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
                InjectVendorPack(apppack)
            }
            this._push(...args);
        }
        let apppack = window.webpackJsonp.find((e) => {
            return e[0] && e[0].includes("vendors")
        })
        if (apppack) {
            InjectVendorPack(apppack)
        }
    }

    function getUID() {
        // 从 Cookie 中获取 UID
        let ck = document.cookie.split('; ').find(row => {
            return row.startsWith('DedeUserID=');
        });
        if (ck) {
            let uid = ck.split('=')[1];
            return uid;
        }
        myConsole.warn("获取UID失败，可能是因为没有登录或Cookie未设置。")
        return 0;
    }

    function ForceLivePermission(res) {
        try {
            myConsole.info(`当前直播权限 ${res.data.allow_live} 粉丝数量要求 ${res.data.fans_threshold} 是否需要提示 ${res.data.need_notice}`)
            if (!res.data.allow_live && typeof res.data.allow_live == 'boolean') {
                res.data.allow_live = true;
            }
        } catch (error) {
            myConsole.error("处理直播权限时出错：", error);
        }

        return res
    }

    function FixNoQRCode(res) {
        try {
            if (res.code == 60024 && res.data.qr == "") {
                res.data.qr = "https://www.bilibili.com/blackboard/live/face-auth-middle.html?source_event=400&mid=" + getUID()
            }
        } catch (error) {
            myConsole.error("修正人脸识别无二维码时出错：", error);
        }
        return res
    }

    // 选这个注入点是因为我怕和其他脚本打架，后续如果这个注入点失效，那我只好拿回传统注入点了。
    function InjectVendorPack(pack) {
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
                        if (args[0].transformResponse.toString() == "[object Object]") {
                            args[0].transformResponse["FixNoQRCode"] = FixNoQRCode
                        } else {
                            args[0].transformResponse.push(FixNoQRCode)
                        }
                        myConsole.log("override start live request success.")
                    }

                    if (args[0].url == "//api.live.bilibili.com/xlive/app-blink/v1/live/GetWebLivePermission") {
                        // 我不知道为什么他是个对象而不是数组，但既然不是，那我瞎来也不是不行？
                        if (args[0].transformResponse.toString() == "[object Object]") {
                            args[0].transformResponse["ForceAllowLive"] = ForceLivePermission
                        } else {
                            args[0].transformResponse.push(ForceLivePermission)
                        }
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
})();
