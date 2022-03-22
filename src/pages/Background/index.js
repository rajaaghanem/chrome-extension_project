console.log('This is the background page.');
console.log('Put the background scripts here.');

// chrome.actiont.onClicked.addListener((tab) => {
//   chrome.scripting.executeScript(tab.id, { file: 'contentScript.bundle.js' });
// });

chrome.tabs.onUpdated.addListener(function (tabId, tab) {
  chrome.scripting.executeScript({
    files: ['contentScript.bundle.js'],
    target: { tabId: tab.id },
  });
});
