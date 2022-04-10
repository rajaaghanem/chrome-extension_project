// chrome.devtools.panels.create(
//   'Dev Tools from chrome-extension-boilerplate-react',
//   'icon-34.png',
//   'panel.html'
// );

import {isWixSite} from '../Content/utiles/utiles.js';
import axios from 'axios';

//Listening to 'start' message and return success: true if the site is wix site, otherwise return success: false 
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.name === 'start') {
    if(isWixSite())
    sendResponse({ success: true });
    else sendResponse({ success: false });
  }
});

