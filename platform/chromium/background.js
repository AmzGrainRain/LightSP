chrome.runtime.onInstalled.addListener(({ reason }) => {
    if (reason === 'install') {
        chrome.tabs.create({
            url: "https://www.bing.com/search?q=edge浏览器如何启用扩展"
        });
    }
});
