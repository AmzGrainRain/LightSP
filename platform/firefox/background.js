const SUGGESTION_MESSAGE_TYPE = 'getKeywordSuggestions';
const MAX_QUERY_LENGTH = 100;
const BAIDU_ORIGIN = 'https://www.baidu.com/*';
const extensionApi = globalThis.browser ?? globalThis.chrome;
const runtime = extensionApi?.runtime;

const hasBaiduPermission = async () => {
  if (!extensionApi?.permissions?.contains) return true;

  return extensionApi.permissions.contains({ origins: [BAIDU_ORIGIN] });
};

runtime?.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== SUGGESTION_MESSAGE_TYPE) return;

  const query = typeof message.query === 'string' ? message.query.trim() : '';
  if (!query || query.length > MAX_QUERY_LENGTH) {
    sendResponse({});
    return;
  }

  hasBaiduPermission()
    .then((granted) => {
      if (!granted) {
        sendResponse({ permissionRequired: true });
        return null;
      }

      const url = `https://www.baidu.com/sugrec?ie=utf-8&prod=pc&from=pc_web&json=1&wd=${encodeURIComponent(query)}`;
      return fetch(url).then((response) => (response.ok ? response.json() : {}));
    })
    .then((response) => response && sendResponse(response))
    .catch(() => sendResponse({}));

  return true;
});
