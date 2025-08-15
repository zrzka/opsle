let clickedEl = null;

document.addEventListener("contextmenu", function(event) {
  clickedEl = event.target;
}, true);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request == "getOPSLELinkData") {
    let target = clickedEl;
    let response = null;
    while (target && target.tagName !== 'A') {
      target = target.parentElement;
    }
    if (target) {
      response = {
        linkUrl: target.href,
        title: target.textContent.trim()
      };
    }
    sendResponse(response);
    return true;
  }
  return false;
});
