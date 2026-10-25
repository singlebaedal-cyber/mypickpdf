chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "pdfpick-open",
    title: "pdfpick에서 무료 PDF 편집·합치기·압축·한글변환 열기",
    contexts: ["page", "link", "selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "pdfpick-open") {
    chrome.tabs.create({ url: "https://pdfpick.kr" });
  }
});
