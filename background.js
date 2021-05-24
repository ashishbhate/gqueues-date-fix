browser.tabs.onUpdated.addListener(
    function(tabId, changeInfo, tabInfo) {
            browser.tabs.sendMessage(tabId, {reload: true, d: {tabId, changeInfo, tabInfo}})
    }, 
    {urls: ["*://*.gqueues.com/*"], properties: ["url"]}
);
