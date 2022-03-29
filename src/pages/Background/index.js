import 'regenerator-runtime/runtime.js';
import axios from 'axios';
import fetchAdapter from '@vespaiach/axios-fetch-adapter';
import { createQAUrl } from '../Content/utiles/utiles.js';
console.log('This is the background page.');

// chrome.actiont.onClicked.addListener((tab) => {
//   chrome.scripting.executeScript(tab.id, { file: 'contentScript.bundle.js' });
// });

let currentUrl, currentTabId;
chrome.tabs.onUpdated.addListener(function (tabId, { url }, tab) {
  if (currentUrl !== url || currentTabId !== tabId) {
    chrome.scripting.executeScript({
      files: ['contentScript.bundle.js'],
      target: { tabId },
    });
    currentUrl = url;
    currentTabId = tabId;
  }
});

// send message to the contentScript if the url doesn't include isqa=true and create new url with isqa=true
chrome.tabs.onUpdated.addListener((tabId) => {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, async (tabs) => {
    let url = await tabs[0].url;
    console.log(url);
    if (!url.includes('isqa=true')) {
      const newUrl = createQAUrl(url);
      chrome.tabs.sendMessage(
        tabId,
        { name: 'newUrl' },
        ({ success, error }) => {
          if (!success) {
            console.log(error);
            return;
          }
          chrome.tabs.create({ url: newUrl });
        }
      );
    } else {
      chrome.tabs.sendMessage(tabId, { name: 'currentUrl' });
    }
  });
});

// setTimeout(async () => {
//   const obj = {
//     fields: {
//       project: {
//         key: 'ECL',
//       },
//       summary: 'test created with axios',

//       issuetype: {
//         name: 'Bug',
//       },
//       // assignee: 'rajaag',
//     },
//   };

//   try {
//     console.log('in settimeout');
//     const res = await axios.post(
//       `https://jira.wixpress.com/rest/api/2/issue`,
//       obj,
//       {
//         withCredentials: true,
//         // headers: {
//         //   // 'Authorization': `Basic ${myToken}`,
//         //   Cookie: cookies,
//         // },
//         adapter: fetchAdapter,
//       }
//     );
//     console.log(res);
//   } catch (e) {
//     const errorResult = { error: e.message, exception: e };
//     console.log(e);
//   }
// }, 5000);
