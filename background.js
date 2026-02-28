const ext = typeof browser !== "undefined" ? browser : chrome;

ext.runtime.onInstalled.addListener(() => {
  // Right click on the page
  ext.contextMenus.create({
    id: "opsle-store-page-link",
    title: "Store Page Link and Title",
    contexts: ["page"]
  });

  // Right click on the link
  ext.contextMenus.create({
    id: "opsle-store-link",
    title: "Store Link and Title",
    contexts: ["link"]
  });

  // Right click on the selection
  ext.contextMenus.create({
    id: "opsle-store-selection",
    title: "Store Page Link and Selection",
    contexts: ["selection"]
  });
});

function openOrgProtocol(tab, data) {
  if (!tab || !tab.id || !data || !data.url) {
    console.error("No URL provided.");
    return;
  }

  const params = new URLSearchParams({
    url: data.url,
    title: data.title
  });

  const orgUrl = `org-protocol://store-link?${params.toString()}`;

  ext.tabs.sendMessage(tab.id, { type: "openOrgProtocol", url: orgUrl }, (response) => {
    if (ext.runtime.lastError || !response || response.ok !== true) {
      ext.tabs.create({ url: orgUrl });
    }
  });
}

if (ext.action && ext.action.onClicked) {
  ext.action.onClicked.addListener((tab) => {
    openOrgProtocol(tab, { url: tab.url, title: tab.title });
  });
} else if (ext.browserAction && ext.browserAction.onClicked) {
  ext.browserAction.onClicked.addListener((tab) => {
    openOrgProtocol(tab, { url: tab.url, title: tab.title });
  });
}

ext.contextMenus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
  case "opsle-store-page-link":
    openOrgProtocol(tab, { url: info.pageUrl, title: tab.title });
    break;
  case "opsle-store-link":
    if (info.linkUrl) {
      const fallbackTitle = info.linkText && info.linkText.trim() ? info.linkText.trim() : info.linkUrl;
      openOrgProtocol(tab, { url: info.linkUrl, title: fallbackTitle });
      break;
    }

    if (tab && tab.id) {
      ext.tabs.sendMessage(tab.id, "getOPSLELinkData", (response) => {
        if (ext.runtime.lastError || !response || !response.linkUrl) {
          console.warn("Could not connect to the content script.");
          return;
        }

        const linkUrl = response.linkUrl;
        const linkTitle = response.title ? response.title : linkUrl;

        openOrgProtocol(tab, { url: linkUrl, title: linkTitle });
      });
    }
    break;
  case "opsle-store-selection":
    openOrgProtocol(tab, { url: info.pageUrl, title: info.selectionText });
    break;
  }
});
