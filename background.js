chrome.runtime.onInstalled.addListener(() => {
  // Right click on the page
  chrome.contextMenus.create({
    id: "opsle-store-page-link",
    title: "Store Page Link and Title",
    contexts: ["page"]
  });

  // Right click on the link
  chrome.contextMenus.create({
    id: "opsle-store-link",
    title: "Store Link and Title",
    contexts: ["link"]
  });

  // Right click on the selection
  chrome.contextMenus.create({
    id: "opsle-store-selection",
    title: "Store Page Link and Selection",
    contexts: ["selection"]
  });
});

function openOrgProtocol(tab, data) {
  if (!data.url) {
    console.error("No URL provided.");
    return;
  }

  const params = new URLSearchParams({
    url: data.url,
    title: data.title
  });

  const orgUrl = `org-protocol://store-link?${params.toString()}`;

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: (url) => {
      location.href = url;
    },
    args: [orgUrl]
  });
}

chrome.action.onClicked.addListener((tab) => {
  openOrgProtocol(tab, { url: tab.url, title: tab.title });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
  case "opsle-store-page-link":
    openOrgProtocol(tab, { url: info.pageUrl, title: tab.title });
    break;
  case "opsle-store-link":
    if (tab && tab.id) {
      chrome.tabs.sendMessage(tab.id, "getOPSLELinkData", (response) => {
        if (chrome.runtime.lastError) {
          console.warn("Could not connect to the content script.");
          const linkUrl = response.linkUrl;
          openOrgProtocol(tab, { url: linkUrl, title: linkUrl });
          return;
        }

        const linkUrl = response.linkUrl;
        let linkTitle = response && response.title ? response.title : linkUrl;

        openOrgProtocol(tab, { url: linkUrl, title: linkTitle });
      });
    }
    break;
  case "opsle-store-selection":
    openOrgProtocol(tab, { url: info.pageUrl, title: info.selectionText });
    break;
  }
});
