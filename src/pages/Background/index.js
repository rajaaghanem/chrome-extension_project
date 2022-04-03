import 'regenerator-runtime/runtime.js';
import axios from 'axios';
import fetchAdapter from '@vespaiach/axios-fetch-adapter';

console.log('This is the background page.');

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
