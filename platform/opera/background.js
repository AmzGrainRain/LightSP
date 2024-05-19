const redirectURLS = [
    "opera://startpage/",
    "browser://startpage/",
    "chrome://startpage/",
    "about:blank",
    ""
];

chrome.tabs.onCreated.addListener(function (tab) {
    if (!redirectURLS.includes(tab.url)) return;
    chrome.tabs.update(tab.id, { url: "index.html" });
});
