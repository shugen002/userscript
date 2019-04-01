// ==UserScript==
// @name         BiliBili WebSocket Proxy Rebuild
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Shugen
// @match        *://*.bilibili.com/*
// @match        *://*.bilibili.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/pako/1.0.10/pako.min.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    const consts = {
        "WS_OP_HEARTBEAT": 2,
        "WS_OP_HEARTBEAT_REPLY": 3,
        "WS_OP_MESSAGE": 5,
        "WS_OP_USER_AUTHENTICATION": 7,
        "WS_OP_CONNECT_SUCCESS": 8,
        "WS_OP_BATCH_DANMAKU": 9,
        "WS_OP_CHANGEROOM": 12,
        "WS_OP_CHANGEROOM_REPLY": 13,
        "WS_OP_REGISTER": 14,
        "WS_OP_REGISTER_REPLY": 15,
        "WS_OP_UNREGISTER": 16,
        "WS_OP_UNREGISTER_REPLY": 17,
        "WS_OP_DANMAKU": 1000,
        "WS_PACKAGE_HEADER_TOTAL_LENGTH": 16,
        "WS_PACKAGE_OFFSET": 0,
        "WS_HEADER_OFFSET": 4,
        "WS_VERSION_OFFSET": 6,
        "WS_OPERATION_OFFSET": 8,
        "WS_SEQUENCE_OFFSET": 12,
        "WS_COMPRESS_OFFSET": 16,
        "WS_CONTENTTYPE_OFFSET": 17,
        "WS_BODY_PROTOCOL_VERSION_NORMAL": 0,
        "WS_BODY_PROTOCOL_VERSION": 1,
        "WS_BODY_PROTOCOL_VERSION_DEFLATE": 2,
        "WS_HEADER_DEFAULT_VERSION": 1,
        "WS_HEADER_DEFAULT_OPERATION": 1,
        "WS_HEADER_DEFAULT_SEQUENCE": 1,
        "ws_header_default_sequence": 1,
        "WS_HEADER_DEFAULT_COMPRESS": 0,
        "WS_HEADER_DEFAULT_CONTENTTYPE": 0
    }
    var textDecoder = new TextDecoder();
    var textEncoder = new TextEncoder();
    var loggerIncrement = 0;

    function convertToObject(data) {
        var dataView = new DataView(data);
        var result = {
            body: []
        };
        result.packetLen = dataView.getInt32(consts.WS_PACKAGE_OFFSET);
        result.headerLen = dataView.getInt16(consts.WS_HEADER_OFFSET);
        result.ver = dataView.getInt16(consts.WS_VERSION_OFFSET);
        result.op = dataView.getInt32(consts.WS_OPERATION_OFFSET);
        result.seq = dataView.getInt32(consts.WS_SEQUENCE_OFFSET);
        if (dataView.packetLen < data.byteLength) {
            convertToObject(data.slice(0, result.packetLen))
            console.log(data.slice(result.packetLen,data.bodyLength));
        }
        var a=false;
        switch (result.op) {
            case consts.WS_OP_HEARTBEAT_REPLY:
                result.body={count:dataView.getInt32(16)};
                break;
            case consts.WS_OP_HEARTBEAT:
                result.body = textDecoder.decode(data.slice(result.headerLen, result.packetLen));
                break;

            case consts.WS_OP_CONNECT_SUCCESS:
                if(result.packetLen>result.headerLen){
                }else{
                    result.body=void 0;
                    break;
                }
            case consts.WS_OP_REGISTER_REPLY:
            case consts.WS_OP_REGISTER:
            case consts.WS_OP_USER_AUTHENTICATION:
            case consts.WS_OP_MESSAGE:
                a=true;
            default:
                if(!a){
                    console.error("Unknown OperationID",result.op);
                    //result.body=data.slice(result.headerLen, result.packetLen);
                }
                for (var offset = consts.WS_PACKAGE_OFFSET, bodyLength = result.packetLen, packetStart = "", c = ""; offset < data.byteLength; offset += bodyLength) {
                    bodyLength = dataView.getInt32(offset);
                    packetStart = dataView.getInt16(offset + consts.WS_HEADER_OFFSET);
                    try {
                        if (result.ver === consts.WS_BODY_PROTOCOL_VERSION_DEFLATE) {
                            result.deflate = true;
                            var deflateData = data.slice(offset + packetStart, offset + bodyLength),
                                inflateData = pako.inflate(new Uint8Array(deflateData));
                            c = convertToObject(inflateData.buffer)
                        } else {
                            result.deflate = false;
                            c = JSON.parse(textDecoder.decode(data.slice(offset + packetStart, offset + bodyLength)));
                        }
                        c && result.body.push(c)
                    } catch (e) {
                        console.error("decode body error:", new Uint8Array(data), result, e)
                    }
                }
                break;
            case consts.WS_OP_BATCH_DANMAKU:
                var parseData = []
                var g=18;
                var u=dataView.byteLength;
                for (var w = result.headerLen; w < dataView.byteLength; w += u) {
                    u = dataView.getInt32(w);
                    g = dataView.getInt16(w + consts.WS_HEADER_OFFSET);
                    try {
                        parseData.push(JSON.parse(textDecoder.decode(data.slice(w + g, w + u))))
                    } catch (f) {
                        parseData.push(textDecoder.decode(data.slice(w + g, w + u)))
                    }
                }
                result.body=parseData;
                break;
        }
        return result;
    }
    function convertToArrayBuffer(message){
        switch(message.op){
            case consts.WS_OP_USER_AUTHENTICATION:

            break;
        }
        var header= new ArrayBuffer(consts.WS_PACKAGE_HEADER_TOTAL_LENGTH)
        var body = new DataView()
    }

    var proxyDesc = {
        set: function (target, prop, val) {
            if (prop == 'onmessage') {
                var oldMessage = val;
                val = function (e) {
                    console.log(`#${target.WSLoggerId} Msg from server << `, convertToObject(e.data));

                    oldMessage(e);
                };
            }
            return target[prop] = val;
        },
        get: function (target, prop) {
            var val = target[prop];
            if (prop == 'send'){ val = function (data) {
                console.log(`#${target.WSLoggerId} Msg from client >> `, convertToObject(data));
                target.send(data);
            };}
            else if (typeof val == 'function') val = val.bind(target);
            return val;
        }
    };
    window.__rawWebSocket = window.WebSocket;
    window.WebSocket = new Proxy(window.__rawWebSocket, {
        construct: function (target, args, newTarget) {
            var obj = new target(args[0]);
            obj.WSLoggerId = loggerIncrement++;
            console.log(`WebSocket #${obj.WSLoggerId} created, connecting to`, args[0]);
            return new Proxy(obj, proxyDesc);
        }
    })

    function extend(raw) {
        var handler = {}
        return new Proxy(raw, handler);
    }
})();