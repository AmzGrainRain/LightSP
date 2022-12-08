# LightSP - 轻起始页（火狐浏览器）

## 扩展介绍
基于vue3构建的一个简易起始页。[体验在线版](https://www.kihanlee.site/archive/lightsp/)</br>
启用后，此扩展会将空白页覆盖为起始页导航。</br>
火狐扩展商店地址：https://addons.mozilla.org/zh-CN/firefox/addon/lightsp/

## 兼容性
适用于火狐浏览器浏览器。

## 初始化 & 启动
```
npm install && npm run serve
```

## 编译
```
npm run build
```

## 快捷键
使用上下箭头在关键词列表内切换选中项
- ctrl + f 翻译
- ctrl + b 必应搜索
- ctrl + g 谷歌搜索
- ctrl + d 百度开发者搜索

## 个性化
- 毛玻璃效果
- 全局圆角调整
- 搜索框高度调整
- 自定义搜索引擎
- 壁纸聚焦
- 必应壁纸
- 自定义壁纸
- 日期显示与隐藏
- 深色模式
- 跟随系统的深色模式
- 深色壁纸
- 天气的显示与隐藏

## 关于 manifest.json 文件
遵循 [Google Extension](https://developer.mozilla.org/zh-CN/docs/Mozilla/Add-ons/WebExtensions) 开发文档。</br>
兼容性详见：https://developer.mozilla.org/zh-CN/docs/Mozilla/Add-ons/WebExtensions
``` JavaScript
{
  "manifest_version": 2,    // manifest 版本
  "name": "LightSP - 轻起始页",    // 名称
  "version": "2.0.4",   // 版本号
  "browser_action": {
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
  "permissions": [   // 请求包含在此数组内的域名时将不再被 CORS 阻止
    "*://www.baidu.com/*",
    "*://cn.bing.com/"
  ],
  "chrome_url_overrides": { // 将 newtab 页面覆盖为 index.html 文件
    "newtab": "index.html"
  }
}
```
## 开源协议
[MIT](https://opensource.org/licenses/MIT)