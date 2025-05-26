# UserScript

这里是存放我个人觉得可以对外公开的脚本的地方，大家可以随意fork回去修改什么的，欢迎提PR。

此处的所有脚本都不会被我本人上架任何地方，我不对这些被其他人上架的脚本负责。

本人才疏学浅，如果有什么做的不对，不够好的地方，欢迎在issue里面提出或者直接提PR改正。

关于会不会盗号那些事情，请找非对应网站的技术大佬帮你看看，冲塔行为可能导致失效，到时候我还能不能救你就是下回分解了。

## Force Allow Live

[![安装脚本](https://img.shields.io/badge/%E5%AE%89%E8%A3%85%E8%84%9A%E6%9C%AC-ForceAllowLive-blue?logo=Greasy%20Fork)](https://greasyfork.org/scripts/537331)

用来绕过B站直播要求5000粉以上才能使用OBS直播的设定。

为了不和自己其他东西产生可能的打架，选了一个偏僻的注入点，如果后续消失会换成常规注入点，但脚本打架可能就是问题了。

扫脸那些自己在B站找个人发个私信，内容是

```
https://www.bilibili.com/blackboard/live/face-auth-middle.html?source_event=400&mid=你的UID
```

然后点击链接就能扫脸，然后就能开播了

## Bilibili WebSocket Proxy Rebuild

这个脚本是我个人用来观察B站websocket到底在传输什么东西用的，计划添加封包功能，可我现在没有足够的精力来补充这个功能，欢迎大家帮我去完成它，使它成为一个BiliBili Websocket的监控修改框架。

## BiliBili Live Room WebSocket Proxy

这个脚本用来拦截处理直播间内的WebSocket数据，借助了window.DanmakuWebSocket这个东西，这个只有直播房间页内才有。。

### 使用方法

往window.BiliBiliOweMe300000这个数组push你的function(item):bool，如果要保留这个数据包请返回true，丢弃则false，如果要修改就直接改吧。
window.latestReceiver会保存最后一个消息接收器，你可以往发送你的假消息？

## BiliBili Dynamic Enchant

破站动态增强脚本，目前只做了准确发布时间显示、浏览次数显示、发布工具显示，后续会考虑加入其他功能。

(如果没有显示出发布工具就是数据里面没有)
(点击灰色区域会自动log该动态的原始数据到console，已完全解析，不存在里面还要再次JSON.parse的情况)

## 关于协议

这个名字好，而且任何人都可以参与其中，虽然没有任何的限制，但还是希望大家可以在修改后提PR给我，让更多的人可以享受到。。。。
