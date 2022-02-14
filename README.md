# LightSP - 轻起始页（chromium内核浏览器）

## 扩展介绍
基于vue3构建的一个简易起始页。[体验在线版](https://www.kihanlee.site/archive/lightsp/)</br>
启用后，此扩展会将空白页覆盖为起始页导航。</br>
微软浏览器扩展商店地址：https://microsoftedge.microsoft.com/addons/detail/mianbaepkeclkoclkoikhlgdfpdelnfi

## 兼容性
适用于所有chromium内核且支持扩展的浏览器。

## 初始化 & 启动
```
npm install && npm run serve
```

## 编译
```
npm run build
```

## 关于 manifest.json 文件
遵循 [Google Extension](https://developer.chrome.com/docs/extensions/) 开发文档。
``` JavaScript
{
  "manifest_version": 3,    // manifest版本
  "name": "LightSP - 轻起始页",    // 名称
  "version": "2.0.4",   // 版本号
  "action": {
    "default_title": "LightSP - 轻起始页",  // 鼠标悬停在扩展图标时，显示的文字（类似于HTML的abbr标签）
    "default_popup": "popup.html",  // popup窗口文件
    "default_icon": {   // 扩展图标
      "16": "/assets/ico_16x16.png",
      "32": "/assets/ico_32x32.png",
      "48": "/assets/ico_48x48.png",
      "64": "/assets/ico_64x64.png",
      "80": "/assets/ico_80x80.png",
      "96": "/assets/ico_96x96.png",
      "128": "/assets/ico_128x128.png"
    }
  },
  "icons": {    // 扩展图标
    "16": "/assets/ico_16x16.png",
    "32": "/assets/ico_32x32.png",
    "48": "/assets/ico_48x48.png",
    "64": "/assets/ico_64x64.png",
    "80": "/assets/ico_80x80.png",
    "96": "/assets/ico_96x96.png",
    "128": "/assets/ico_128x128.png"
  },
  "author": "kihanlee",   // 开发者
  "description": "基于vue3开发的一款轻巧起始页。",  // 扩展描述
  "default_locale": "zh_CN",    // 默认地区（i18n）
  "host_permissions": [ // 请求包含在此数组内的域名时将不再被 CORS 阻止
    "http://www.baidu.com/",
    "https://www.baidu.com/",
    "http://cn.bing.com/",
    "https://cn.bing.com/"
  ],
  "chrome_url_overrides": { // 将 newtab 页面覆盖为 index.html 文件
    "newtab": "index.html"
  }
}
```
## 开源协议
[MIT](https://opensource.org/licenses/MIT)
