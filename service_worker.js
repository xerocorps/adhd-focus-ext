// Set the initial state to "ON"
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ enabled: true });
  chrome.action.setBadgeText({ text: 'ON' });
  chrome.action.setBadgeBackgroundColor({ color: '#4CAF50' });
});

// Listener for when the extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
  chrome.storage.local.get('enabled', (data) => {
    const enabled = !data.enabled;
    chrome.storage.local.set({ enabled: enabled });

    if (enabled) {
      chrome.action.setBadgeText({ text: 'ON' });
      chrome.action.setBadgeBackgroundColor({ color: '#4CAF50' });
      chrome.tabs.sendMessage(tab.id, { action: 'ENABLE' });
    } else {
      chrome.action.setBadgeText({ text: 'OFF' });
      chrome.action.setBadgeBackgroundColor({ color: '#757575' });
      chrome.tabs.sendMessage(tab.id, { action: 'DISABLE' });
    }
  });
});

// Listener for tab updates (e.g., reloads, new pages)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    chrome.storage.local.get('enabled', (data) => {
      if (data.enabled) {
        chrome.tabs.sendMessage(tabId, { action: 'ENABLE' });
      }
    });
  }
});