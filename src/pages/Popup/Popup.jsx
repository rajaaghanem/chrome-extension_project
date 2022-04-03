import React, {useEffect, useState} from 'react';
import { createQAUrl } from '../Content/utiles/utiles.js';
import './Popup.css';

//Inject the content-script to tab
function injectContentScript(tabId){
    chrome.scripting.executeScript({
      files: ['contentScript.bundle.js'],
      target: { tabId },
    });
}

const Popup = () => {

  const [status, setStatus] = useState("initializing");
  const [url, setUrl] = useState();

  //Set statue to "redirect" if the current tab url doesn't contain "isqa=true", otherwise inject the contentScript to the current tab.
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      console.log(tabs);
      let currentUrl = tabs[0].url;
      setUrl(currentUrl);
      let tabId = tabs[0].id;
      if (!currentUrl.includes('isqa=true')){
        setStatus("redirect");
      }else {
        injectContentScript(tabId);
        window.close();
      }
      console.log(currentUrl);
    })
  }, [])
  
  //Create and open a new tab with adding 'isqa=true' to url.
  function handleRedirect (){
    const newUrl = createQAUrl(url);
    chrome.tabs.create({ url: newUrl, active: false }, (tab)=>{
      chrome.tabs.onUpdated.addListener((tabId, {status})=>{
        if(tabId === tab.id && status === 'complete'){
          injectContentScript(tab.id);
          chrome.tabs.update(tabId, {active: true});
          window.close();
        }
      })
    });
  }
  
  return (
    <div className="App">
      {status === "initializing"? <div>loading...</div> : <button onClick={handleRedirect}>Redirect to isqa mode</button>}
    </div>
  );
};

export default Popup;
