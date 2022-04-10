import React, { useEffect, useState } from 'react';
import { createQAUrl } from '../Content/utiles/utiles.js';
import './Popup.css';

//Inject the content-script to tab
function injectContentScript(tabId) {
  chrome.scripting.executeScript({
    files: ['contentScript.bundle.js'],
    target: { tabId },
  });
}


const Popup = () => {

  const [status, setStatus] = useState('initializing');
  const [url, setUrl] = useState();
  const [wixSite, setWixSite] = useState(false);
  const [jiraLogIn, setJiraLogIn] = useState(false);

  //Set jiraLogIn to true if the user is logged-in in JIRA
  useEffect(() => {
    var port = chrome.runtime.connect({
      name: 'Sample Communication',
    });
    port.postMessage('Hi BackGround');
    port.onMessage.addListener(function (msg) {
      setJiraLogIn(msg.result);
    });
  }, []);

  //Set status to "redirect" if the current tab url doesn't contain "isqa=true", otherwise inject the contentScript to the current tab.
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      let currentUrl = tabs[0].url;
      setUrl(currentUrl);
      let tabId = tabs[0].id;
      handleIsWixSite(tabs, currentUrl, tabId)
    });
  }, [jiraLogIn, setJiraLogIn]);

  //Sending and recieving message from content-script, recieving success if the site is a wix site
  function handleIsWixSite(tabs, currentUrl, tabId){
    chrome.tabs.sendMessage(
      tabs[0].id,
      { name: 'start' },
      ({ success, error }) => {
        if (!success) {
          console.log(error);
          return;
        }
        setWixSite(true);
        handleIsQaURL(currentUrl, tabId);
      }
    );
  }

  //Set status to redirect if the url doesn't containes 'isqa=true', otherwise inject the content script and close the popup
  function handleIsQaURL(currentUrl, tabId){
    if (!currentUrl.includes('isqa=true')) {
      setStatus('redirect');
    } else {
      if (jiraLogIn) {
        injectContentScript(tabId);
        window.close();
      }
    }
  }

  //Create and open a new tab with adding 'isqa=true' to url
  function handleRedirect() {
    const newUrl = createQAUrl(url);
    chrome.tabs.create({ url: newUrl, active: false }, (tab) => {
      chrome.tabs.onUpdated.addListener((tabId, { status }) => {
        if (tabId === tab.id && status === 'complete') {
          injectContentScript(tab.id);
          chrome.tabs.update(tabId, { active: true });
          window.close();
        }
      });
    });
  }

  //Depends on state different values display tags on popup window
  function popupContent() {
    if (!jiraLogIn) return <a href="https://jira.wixpress.com/" target="_blank" rel="noreferrer">Please log-in in Jira</a>;
    else if (!wixSite) return <div>Not a wix site</div>;
    else if (status === 'redirect')
      return <button onClick={handleRedirect}>redirect to isqua url</button>;
    else return <div>loading...</div>;
  }

  return <div className="App">{popupContent()}</div>;
};

export default Popup;
