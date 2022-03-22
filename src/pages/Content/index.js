import { printLine } from './modules/print';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

printLine("Using the 'printLine' function from the Print Module");

console.log("hello I'm the script!!")

// Add bubble to the top of the page.
var bubbleDOM = document.createElement("div");
bubbleDOM.setAttribute("class", "selection_bubble");
bubbleDOM.style.zIndex = "1000";
document.body.appendChild(bubbleDOM);

// Add recoeding div to the selected element
var recordDOM = document.createElement("div");
recordDOM.setAttribute("class", "selection_record");
recordDOM.style.zIndex = "1001";
document.body.appendChild(recordDOM);
var componentName = document.createElement("h3");
recordDOM.appendChild(componentName);

var activeEl = { dataset: {} };
var eventsArray = [];
var selection;
// add const arr of events with map

//mouseenter listener function
var myMouseEnterListener = function (e) {
  handleMouseEnter(this, e);
};

//mouseleave listener function
var myMouseLeaveListener = function (e) {
  handleMouseLeave(this, e);
};

//click listener function
var myClickListener = function (e) {
  renderRecordBox(e.pageX, e.pageY);
  e.preventDefault();
  e.stopPropagation();
  //remove all mouse events
  eventsArray.forEach((el) => {
    if (el.listener === "mouseenter") {
      el.element.removeEventListener("mouseenter", myMouseEnterListener);
    }
    if (el.listener === "mouseleave") {
      el.element.removeEventListener("mouseleave", myMouseLeaveListener);
    }
  });
};

// add events to all data-comp elements
document.querySelectorAll("[data-comp]").forEach((element) => {
  
  element.addEventListener("mouseenter", myMouseEnterListener);
  eventsArray.push({ element, listener: "mouseenter" });

  element.addEventListener("mouseleave", myMouseLeaveListener);
  eventsArray.push({ element, listener: "mouseleave" });

  element.addEventListener("click", myClickListener);
});

// handle mouseenter event
function handleMouseEnter(targetElement, event) {
  removeBubble(targetElement);
  activeEl = targetElement;

  selection = activeEl.dataset.comp;
  if (selection) {
    renderBubble(event.pageX, event.pageY, selection);
    activeEl.style.backgroundColor = "#1b888262";
    activeEl.style.boxShadow = "0 0 0 1px #32E0D6";
  }
  event.stopPropagation();
}

// handle mouseleave event
function handleMouseLeave(targetElement, event) {
  removeBubble(targetElement);
  event.stopPropagation();
}

// add a recording box to the screen
function renderRecordBox(mouseX, mouseY) {
  recordDOM.style.top = mouseY + "px";
  recordDOM.style.left = mouseX + "px";
  addTheComponentName();
  recordDOM.style.visibility = "visible";
}

// add the selected component's name to the recording box
function addTheComponentName(){
  let nameArray = [];
  if(selection){
    nameArray = selection.split('.');
  }
  componentName.innerText = "";
  componentName.setAttribute("class", "selection_record-name");
  componentName.innerText = nameArray[nameArray.length-1];
}

// remove background blue color and boxshadow
function removeBubble(element) {
  element.style.backgroundColor = "transparent";
  element.style.boxShadow = "none";
  bubbleDOM.style.visibility = "hidden";
}

// Move that bubble to the appropriate location.
function renderBubble(mouseX, mouseY, selection) {
  bubbleDOM.innerHTML = selection;
  bubbleDOM.style.top = mouseY + "px";
  bubbleDOM.style.left = mouseX + "px";
  bubbleDOM.style.visibility = "visible";
}

