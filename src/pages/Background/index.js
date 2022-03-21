console.log('This is the background page.');
console.log('Put the background scripts here.');

chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript(tab.id, { file: 'contentScript.bundle.js'});
  });