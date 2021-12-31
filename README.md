# LightSP - 轻起始页（谷歌浏览器）
---
## 扩展介绍
基于vue3构建的一个简易起始页。[体验在线版](https://www.kihanlee.site/lightsp/)

## 兼容性
使用JSONP发送跨域请求，IE兼容性未知。</br>
火狐浏览器请看[这里](https://github.com/KiHanLee/LightSP/tree/firefox)。</br>
基于Chromium内核且支持扩展的浏览器请看[这里](https://github.com/KiHanLee/LightSP/tree/chromium)。

## 初始化 & 启动
```
npm install && npm run serve
```

## 编译
```
npm run build
```

## 使用方法
- 前往[发布页](https://github.com/KiHanLee/LightSP/releases)下载最新发布的版本。
- 将文件解压缩到服务器根目录的 lightnesssp 目录内即可。

## 关于 manifest.json 文件（遵循谷歌扩展开发文档）
manifest文件位于项目内的public目录下，编译后与index.html文件位置相同。
``` JavaScript
{
    "manifest_version": 3,  // manifest版本
    "name": "起始页",   // 扩展名称
    "version": "1.0",   // 扩展版本号
    "action": {
        "default_title": "" // 鼠标悬停在扩展图标时，显示的文字（类似于HTML的abbr标签的那个效果）
    },
    "author": "kihanlee",   // 开发者
    "description": "",  // 扩展描述（管理扩展页面扩展名字下面的那一行小字）
    "host_permissions": [   // 跨域请求包含在此数组内的域名时将不再被 CORS 阻止
        "http://www.baidu.com/",
        "https://www.baidu.com/"
    ],
    "chrome_url_overrides" : {  // 将 newtab 页面覆盖为 index.html 文件
        "newtab": "index.html"
    }
}
```
## 开源协议
[MIT](https://opensource.org/licenses/MIT)
