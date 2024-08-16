// ==UserScript==
// @name         fake mapgenie
// @namespace    http://tampermonkey.net/
// @version      2024-07-31
// @description  try to take over the world!
// @author       You
// @match        https://mapgenie.io/watch-dogs-2/maps/san-francisco
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mapgenie.io
// @grant        none
// ==/UserScript==

(function () {
    let infoItem = JSON.parse(window.localStorage.getItem("info") || JSON.stringify(
        {
            "id": 6662104,
            "role": "user",
            "locations":
                {},
            "gameLocationsCount": 0,
            "hasPro": true,
            "trackedCategoryIds": [],
            "suggestions": [],
            "presets": []
        }
    ))
    function saveInfoItem() {
        window.localStorage.setItem("info", JSON.stringify(infoItem))
    }
    'use strict';
    Object.defineProperty(window, "user", {
        set: function (value) {
            console.log(value);
        },
        get: function () {
            return infoItem
        }
    })
    window.XMLHttpRequest.prototype.__open = window.XMLHttpRequest.prototype.open
    window.XMLHttpRequest.prototype.__send = window.XMLHttpRequest.prototype.send
    /**
     * 
     * @param {string} method 
     * @param {string} url 
     * @param {boolean} async 
     * @param {*} user 
     * @param {*} password 
     * @returns 
     */
    window.XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
        if (url.startsWith("https://mapgenie.io/api/v1/user/locations/")) {
            this.send = function () {
                let id = url.substring(42)
                switch (method) {
                    case "PUT":
                        infoItem.locations[id] = true;
                        break;
                    case "DELETE":
                        delete infoItem.locations[id];
                        break;
                    default:
                        break;
                }
                saveInfoItem()
                this.dispatchEvent(new Event("loadend"))
            }
            this.setRequestHeader = () => { }
            return;
        }
        if (url.startsWith("https://mapgenie.io/api/v1/user/categories")) {
            this.send = function (rawdata) {
                let data = JSON.parse(rawdata)
                switch (method) {
                    case "POST":
                        infoItem.trackedCategoryIds.push(data.category)
                        break;
                    case "DELETE":
                        let id = parseInt(url.substring(43))
                        let index = infoItem.trackedCategoryIds.indexOf(id)
                        if (index != 1) {
                            infoItem.trackedCategoryIds.splice(index, 1)
                        }
                        break;
                    default:
                        break;
                }
                saveInfoItem()
                this.dispatchEvent(new Event("loadend"))
            }
            this.setRequestHeader = () => { }
            return;
        }
        return this.__open(method, url, async, user, password);
    }
})();