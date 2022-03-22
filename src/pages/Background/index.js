console.log('This is the background page.');
console.log('Put the background scripts here.');

// chrome.actiont.onClicked.addListener((tab) => {
//   chrome.scripting.executeScript(tab.id, { file: 'contentScript.bundle.js' });
// });
let currentUrl, currentTabId;
chrome.tabs.onUpdated.addListener(function (tabId, {url}, tab) {
  if(currentUrl !== url || currentTabId !== tabId){
    chrome.scripting.executeScript({
      files: ['contentScript.bundle.js'],
      target: { tabId },
    });
    currentUrl = url;
    currentTabId = tabId;
  }
});
