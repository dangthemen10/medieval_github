// Khởi tạo khi extension được cài đặt
chrome.runtime.onInstalled.addListener(() => {
  console.log('Medieval Github Extension installed!');

  // Set default state
  chrome.storage.sync.set({
    medievalEnabled: false,
  });
});

// Lắng nghe messages từ popup và content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background received message:', message);

  switch (message.action) {
    case 'toggleMedieval':
      handleToggleMedieval(message.enabled, sender.tab?.id);
      break;

    case 'getState':
      // Trả về state hiện tại cho content script
      chrome.storage.sync.get(['medievalEnabled'], (result) => {
        sendResponse({ enabled: result.medievalEnabled || false });
      });
      return true; // Báo cho Chrome biết sẽ response async

    case 'pageLoaded':
      // Khi trang GitHub mới load, check state và apply nếu cần
      handlePageLoaded(sender.tab?.id);
      break;
  }
});

// Xử lý toggle Medieval mode
async function handleToggleMedieval(enabled, tabId) {
  try {
    // Lưu state
    await chrome.storage.sync.set({ medievalEnabled: enabled });

    // Gửi message đến content script nếu có tabId
    if (tabId) {
      chrome.tabs
        .sendMessage(tabId, {
          action: 'applyMedievalMode',
          enabled: enabled,
        })
        .catch((err) => {
          console.log('Tab might be closed or not ready:', err);
        });
    }

    // Gửi đến tất cả tabs GitHub đang mở
    const tabs = await chrome.tabs.query({ url: '*://github.com/*' });
    tabs.forEach((tab) => {
      chrome.tabs
        .sendMessage(tab.id, {
          action: 'applyMedievalMode',
          enabled: enabled,
        })
        .catch((err) => {
          console.log('Could not send message to tab:', tab.id, err);
        });
    });
  } catch (error) {
    console.error('Error in handleToggleMedieval:', error);
  }
}

// Xử lý khi trang mới được load
async function handlePageLoaded(tabId) {
  try {
    const result = await chrome.storage.sync.get(['medievalEnabled']);
    const enabled = result.medievalEnabled || false;

    if (enabled && tabId) {
      // Delay một chút để đảm bảo DOM đã load xong
      setTimeout(() => {
        chrome.tabs
          .sendMessage(tabId, {
            action: 'applyMedievalMode',
            enabled: true,
          })
          .catch((err) => {
            console.log('Could not apply medieval mode to new page:', err);
          });
      }, 500);
    }
  } catch (error) {
    console.error('Error in handlePageLoaded:', error);
  }
}

// Theo dõi khi tab được update (navigation)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Chỉ xử lý khi trang load xong và là trang GitHub
  if (
    changeInfo.status === 'complete' &&
    tab.url &&
    tab.url.includes('github.com')
  ) {
    handlePageLoaded(tabId);
  }
});

// Xử lý khi extension action được click (nếu không có popup)
chrome.action.onClicked.addListener(async (tab) => {
  // Code này chỉ chạy nếu không có popup
  // Vì bạn đã có popup rồi nên phần này không cần thiết
  console.log('Extension icon clicked on tab:', tab.id);
});

// Utility function để log state
async function logCurrentState() {
  try {
    const result = await chrome.storage.sync.get(['medievalEnabled']);
    console.log('Current Medieval mode state:', result.medievalEnabled);
  } catch (error) {
    console.error('Error getting state:', error);
  }
}
