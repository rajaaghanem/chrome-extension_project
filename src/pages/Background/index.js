import "regenerator-runtime/runtime.js";
import axios from 'axios';
import fetchAdapter from '@vespaiach/axios-fetch-adapter';
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


setTimeout(async () => {
  try {
    console.log("in settimeout");
    const res = await axios.get(`https://pbo.wix.com/fire-console/serverSign?appDefId=${process.env.APP_ID}`,
    {
      adapter: fetchAdapter,
    });
    console.log(res);
    const response = await axios({
      method: 'get',
      url: `https://bo.wix.com/jira-gateway-web/api/jira/v3/issues/ECL-4276`,
      headers: { 'Authorization': res.data.signature, 'Content-Type': 'application/json'},
      mode: 'cors',
      adapter: fetchAdapter,
      
    });
    // const data = await response.json();
    console.log(response);
  } catch (e) {
    const errorResult = { error: e.message, exception: e };
    console.log(e);
  }
}, 5000);