# LightnessSP - 拒绝花里胡哨（谷歌浏览器）
---
## 扩展介绍
基于vue3构建的一个简易起始页。（浏览器扩展）
启用后，此扩展会将空白页覆盖为起始页导航。

## 兼容性
适用于所有chromium内核且支持扩展的浏览器。

## 初始化
```
npm install && npm run serve
```

## 编译
```
npm run build
```

## 使用方法
>进行此步骤需要提前部署 **[NodeJS](http://nodejs.cn)** 和 **[VueCli](https://cli.vuejs.org/zh/guide/)** 环境。
```
git clone https://github.com/CodeFarmers-GRC/StartPage.git
npm init
npm run build
```
终端执行上述操作后，进入浏览器扩展页面，启用**开发者模式**。
点击**加载已解压的扩展**，在弹出的对话框内选中**dist**目录即可。

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
