// create new url with isqa=true
export function createQAUrl(address) {
  const url = new URL(address);
  url.searchParams.append("isqa","true");
  return url.toString();
  }

// set of the special QA Components 
export const specialQAComp = new Set();

const specialQACompArray = ['wysiwyg.viewer.components.inputs.RadioButton','core.components.MenuButton', 'wysiwyg.viewer.components.Day', 'wysiwyg.viewer.components.BoxSlideShowSlide', 'wysiwyg.viewer.components.StripContainerSlideShowSlide']

for(let i=0; i<specialQACompArray.length; i++){
  specialQAComp.add(specialQACompArray[i]);
}