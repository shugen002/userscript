// ==UserScript==
// @name         BiliBili Dynamic Enchant
// @version      0.1
// @description  破站动态增强，增加发布时间和浏览次数显示
// @author       Shugen
// @match        *://*.bilibili.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var observer=new MutationObserver(checkRecords);
    var DynamicInfo={};
    observer.observe(document.body,{childList:true,subtree:true})

    function checkRecords(records){
        
        var addedDynamic=[];
        records.filter(checktype).forEach((record)=>{
            Array.from(record.addedNodes).filter(isMainContent).forEach((element)=>{
                if(record.target.hasAttribute("data-did")){
                    addedDynamic.push(record.target);
                    return;
                }
            });
        })
        addedDynamic.filter(isLoaded).forEach(loadDynamicInfo);
    }
    function checktype(record){
        return record.addedNodes.length>0
    }
    function isMainContent(element){
        return element.classList && element.classList.contains("main-content")
    }
    function isLoaded(element){
        return !element.getElementsByClassName("main-content")[0].hasAttribute("data-da-load")
    }
    function loadDynamicInfo(element){
        let cardInfo=parseAll(JSON.stringify(element.__vue__._props.cardInfo))
        /**
         * @type {HTMLDivElement}
         */
        let mainContent=element.getElementsByClassName("main-content")[0];
        element.getElementsByClassName("main-content")[0].setAttribute("data-da-load","")
        var detailElement=document.createElement("div");
        detailElement.style.backgroundColor="rgba(0,0,0,0.05)"
        detailElement.style.padding="4px"
        detailElement.style.borderRadius="4px"
        detailElement.style.color="#99a2aa"
        detailElement.appendChild(createTextItem(cardInfo.desc.view+" 次浏览"));
        detailElement.appendChild(createTextItem("于 "+new Date(cardInfo.desc.timestamp*1000).toLocaleString()+" 发布"));
        if(cardInfo.extend_json && cardInfo.extend_json.from && cardInfo.extend_json.from.from && cardInfo.extend_json.from.from !== ""){
            detailElement.appendChild(createTextItem("通过 "+cardInfo.extend_json.from.from+" 发布"))
        }
        detailElement.onclick=()=>{console.log(cardInfo)}
        mainContent.insertBefore(detailElement,mainContent.getElementsByClassName("button-bar")[0])
    }
    function createTextItem(text){
        var item=document.createElement("p");
        item.innerText=text
        return item
    }

    function parseAll(toParseItem){
        let item=toParseItem
        if(typeof item ==="string"){
            try {
                if((item[0]=="[" && item[item.length-1]=="]")||(item[0]=="{" && item[item.length-1]=="}")){
                    item = JSON.parse(item);
                    let keys=Object.keys(item);
                    keys.forEach((key)=>{
                        item[key]=parseAll(item[key])
                    })
                }
            } catch (error) {
            }
        }else{
            let keys=Object.keys(item);
            keys.forEach((key)=>{
                item[key]=parseAll(item[key])
            })
        }
        return item;
    }
})();