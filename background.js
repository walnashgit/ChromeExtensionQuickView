chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "openPreview") {
    chrome.windows.create({
      url: request.url,
      type: "popup",
      width: 400,
      height: 300
    });
  }
});
