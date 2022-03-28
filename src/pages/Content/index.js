import '../Content/content.styles.css';


//changing background color and create a tooltip with the cmponent data-comp when hover over the component.
function hoverAndRecording() {
  const dataCompBubble = document.createElement('div');
  const recordingBox = document.createElement('div');
  const urlComponent = document.createElement('div');
  const recordingComponent = document.createElement('div');
  const jiraTicketComponent = document.createElement('div');
  const componentName = document.createElement('h3');
  const eventsArray = [];
  createUrlComponent(urlComponent);
  createRecordingComponent(recordingComponent);
  createBubble(dataCompBubble);
  createRecordBox(recordingBox);
  createEvents();

  // create url component in record-box component
  function createUrlComponent(componentUrl) {
    const urlParagraph = document.createElement('p');
    urlParagraph.innerHTML = 'URL';
    const url = document.createElement('p');
    url.innerHTML = 'https://...';
    componentUrl.appendChild(urlParagraph);
    componentUrl.appendChild(url);
  }

  // create recording component in record-box component
  function createRecordingComponent(componentRecord) {
    const recordParagraph = document.createElement('p');
    recordParagraph.innerHTML = 'Record a Bug';
    const recordingButton = document.createElement('button');
    recordingButton.setAttribute('class', 'selection_bubble');
    recordingButton.innerHTML = 'Record';
    componentRecord.appendChild(recordParagraph);
    componentRecord.appendChild(recordingButton);
    createRecordingBtnEvent(recordingButton);
  }

  // create a bubble element
  function createBubble(bubbleDOM) {
    bubbleDOM.setAttribute('class', 'selection_bubble');
    bubbleDOM.style.zIndex = '1000';
    bubbleDOM.style.position = 'fixed';
    document.body.appendChild(bubbleDOM);
  }

  //create a record-box element
  function createRecordBox(recordDOM) {
    recordDOM.setAttribute('class', 'selection_record');
    recordDOM.style.zIndex = '1001';
    recordDOM.style.position = 'fixed';
    document.body.appendChild(recordDOM);
    recordDOM.appendChild(componentName);
    recordDOM.appendChild(urlComponent);
    recordDOM.appendChild(recordingComponent);
  }

  // add events to all data-comp elements and add mouse events to the events array
  function createEvents() {
    document.querySelectorAll('[data-comp]').forEach((element) => {
      element.addEventListener('mouseenter', handleMouseEnter);
      eventsArray.push({ element, listener: 'mouseenter' });

      element.addEventListener('mouseleave', handleMouseLeave);
      eventsArray.push({ element, listener: 'mouseleave' });

      element.addEventListener('click', myClickListener);
    });
  }

  // start recording by clicking the recording button
  function createRecordingBtnEvent(buttonComponent) {
    buttonComponent.addEventListener('click', async function () {
      let stream = await recordScreen();
      let mimeType = 'video/webm';
      let mediaRecorder = createRecorder(stream, mimeType);
      recordingBox.style.visibility = 'hidden';
    });
  }

  // dusplay the screen recording option to the user
  async function recordScreen() {
    return await navigator.mediaDevices.getDisplayMedia({
      audio: true,
      video: { mediaSource: 'screen' },
    });
  }

  // Create a screen recorder using MediaRecorder
  function createRecorder(stream, mimeType) {
    // the stream data is stored in this array
    let recordedChunks = [];

    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = function (e) {
      if (e.data.size > 0) {
        recordedChunks.push(e.data);
      }
    };
    mediaRecorder.onstop = function () {
      saveFile(recordedChunks);
      recordedChunks = [];
      recordingBox.style.visibility = 'visible';
    };
    mediaRecorder.start(200); // For every 200ms the stream data will be stored in a separate chunk.
    return mediaRecorder;
  }

  // Create a video URL and save the video file
  function saveFile(recordedChunks) {
    const blob = new Blob(recordedChunks, {
      type: 'video/webm',
    });
    let filename = window.prompt('Enter file name'),
      downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `${filename}.webm`;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    URL.revokeObjectURL(blob); // clear from memory
    document.body.removeChild(downloadLink);
  }

  //return the element data-comp name value
  function getElementDataComp(element) {
    let nameArray = [];
    const selection = element.dataset.comp;
    nameArray = selection.split('.');
    return nameArray[nameArray.length - 1];
  }

  // handle mouseenter event : change the background color and add a data-comp name bubble
  function handleMouseEnter(event) {
    const targetElement = event.currentTarget;
    event.stopPropagation();
    removeBubble(targetElement, dataCompBubble);
    const selection = getElementDataComp(targetElement);
    if (selection) {
      renderBubble(event.clientX, event.clientY, selection, dataCompBubble);
      targetElement.style.backgroundColor = '#1b888262';
      targetElement.style.boxShadow = '0 0 0 1px #32E0D6';
    }
  }

  // Move that bubble to the appropriate location.
  function renderBubble(mouseX, mouseY, selection, bubbleDOM) {
    bubbleDOM.innerHTML = selection;
    bubbleDOM.style.top = mouseY + 'px';
    bubbleDOM.style.left = mouseX + 'px';
    bubbleDOM.style.visibility = 'visible';
  }

  // handle mouseleave event : remove the data-comp name bubble
  function handleMouseLeave(event) {
    event.stopPropagation();
    const targetElement = event.currentTarget;
    removeBubble(targetElement, dataCompBubble);
  }

  //handle click event : create a recording box remove all mouse events
  function myClickListener(event) {
    event.preventDefault();
    event.stopPropagation();

    renderRecordBox(
      event.clientX,
      event.clientY,
      recordingBox,
      event.currentTarget
    );
    removeBubble(event.currentTarget, dataCompBubble);
    eventsArray.forEach((element) => {
      if (element.listener === 'mouseenter') {
        element.element.removeEventListener('mouseenter', handleMouseEnter);
      }
      if (element.listener === 'mouseleave') {
        element.element.removeEventListener('mouseleave', handleMouseLeave);
      }
    });
  }

  // add a recording box to the screen
  function renderRecordBox(mouseX, mouseY, recordDOM, element) {
    recordDOM.style.top = mouseY + 'px';
    recordDOM.style.left = mouseX + 'px';
    addTheComponentName(element);
    recordDOM.style.visibility = 'visible';
  }

  // add the selected component's name to the recording box
  function addTheComponentName(element) {
    const selection = getElementDataComp(element);
    componentName.innerText = '';
    componentName.setAttribute('class', 'selection_record-name');
    componentName.innerText = selection;
  }

  // remove background blue color and boxshadow
  function removeBubble(element, bubbleDOM) {
    element.style.backgroundColor = 'transparent';
    element.style.boxShadow = 'none';
    bubbleDOM.style.visibility = 'hidden';
  }
}

hoverAndRecording();
