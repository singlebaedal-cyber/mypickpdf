chrome.runtime.onInstalled.addListener(() => {
  const title = chrome.i18n.getMessage("contextMenuTitle") || "Open pdfpick Private PDF Tools";
  chrome.contextMenus.create({
    id: "pdfpick-open",
    title: title,
    contexts: ["page", "link", "selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "pdfpick-open") {
    chrome.tabs.create({ url: "https://pdfpick.kr" });
  }
});
