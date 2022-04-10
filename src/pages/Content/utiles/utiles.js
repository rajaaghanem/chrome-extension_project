
//Create new url with isqa=true
export function createQAUrl(address) {
  const url = new URL(address);
  url.searchParams.append('isqa', 'true');
  return url.toString();
}

//Set of the special QA Components
export const specialQAComp = new Set();

const specialQACompArray = [
  'wysiwyg.viewer.components.inputs.RadioButton',
  'core.components.MenuButton',
  'wysiwyg.viewer.components.Day',
  'wysiwyg.viewer.components.BoxSlideShowSlide',
  'wysiwyg.viewer.components.StripContainerSlideShowSlide',
];

for (let i = 0; i < specialQACompArray.length; i++) {
  specialQAComp.add(specialQACompArray[i]);
}

//Check if the site is a wix site
export function isWixSite(url) {
  function isAnEditorSite() {
    const editorDomains = [
      'editor.wix',
      'create.editorx',
      'local.editorx',
      'blocks.wix',
    ];
    return editorDomains.some((domain) => document.URL.includes(domain));
  }

  function isAnSeoVersionOfTheSite() {
    return document.URL.includes('?_escaped_fragment_=');
  }

  function hasWixIndicatorInScripts() {
    return Array.from(document.scripts).some(
      (script) =>
        script.outerHTML.includes('serviceTopology') ||
        script.outerHTML.includes('thunderboltVersion')
    );
  }

  return (
    !isAnEditorSite() &&
    !isAnSeoVersionOfTheSite() &&
    hasWixIndicatorInScripts()
  );
}

