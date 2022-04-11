import 'regenerator-runtime/runtime.js';
import axios from 'axios';
import fetchAdapter from '@vespaiach/axios-fetch-adapter';

//Make an axios requset using JIRA API, Return true if the current user is looged-in to JIRA, otherwise return false
async function jiraLoggedIn() {
  try {
    const res = await axios.get(`https://jira.wixpress.com/rest/api/2/myself`, {
      withCredentials: true,
      headers: { crossorigin: true, 'Access-Control-Allow-Headers': '*' },
      adapter: fetchAdapter,
    });
    return res.status === 200;
  } catch (e) {
    return false;
  }
}

//Connect to the port and listening to messages, send back the JIRA API current user request response
chrome.runtime.onConnect.addListener(function(port) {
    port.onMessage.addListener(async function(msg) {
        if(msg.type === 'login'){
            const res = await jiraLoggedIn();
            port.postMessage({result: res});
        }
    });
})


//for future useage
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
