// Khởi tạo extension với state mặc định
chrome.runtime.onInstalled.addListener(() => {
  console.log('Medieval Github Extension installed!');
  chrome.storage.sync.set({ medievalEnabled: false });
});

// Xử lý tất cả messages từ popup và content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background received message:', message);

  switch (message.action) {
    case 'toggleMedieval':
      // Bật/tắt Medieval mode
      handleToggleMedieval(message.enabled, sender.tab?.id);
      break;

    case 'getState':
      // Trả về state hiện tại cho content script
      chrome.storage.sync.get(['medievalEnabled'], (result) => {
        sendResponse({ enabled: result.medievalEnabled || false });
      });
      return true; // Báo cho Chrome biết sẽ response async

    case 'pageLoaded':
      // Khi trang GitHub mới load, apply Medieval mode nếu đang enabled
      handlePageLoaded(sender.tab?.id);
      break;
  }
});

// Xử lý toggle Medieval mode và sync với tất cả tabs GitHub
async function handleToggleMedieval(enabled, tabId) {
  try {
    // Lưu state vào storage
    await chrome.storage.sync.set({ medievalEnabled: enabled });

    // Lấy tất cả tabs GitHub đang mở
    const tabs = await chrome.tabs.query({ url: '*://github.com/*' });

    // Gửi message đến tất cả tabs để apply/remove Medieval mode
    const messagePromises = tabs.map((tab) =>
      chrome.tabs
        .sendMessage(tab.id, {
          action: 'applyMedievalMode',
          enabled: enabled,
        })
        .catch((err) => {
          console.log(`Could not send message to tab ${tab.id}:`, err);
        })
    );

    await Promise.all(messagePromises);
  } catch (error) {
    console.error('Error in handleToggleMedieval:', error);
  }
}

// Apply Medieval mode cho trang mới load nếu đang enabled
async function handlePageLoaded(tabId) {
  if (!tabId) return;

  try {
    const result = await chrome.storage.sync.get(['medievalEnabled']);
    const enabled = result.medievalEnabled || false;

    if (enabled) {
      // Delay để đảm bảo DOM đã load xong
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

// Theo dõi navigation trên GitHub và auto-apply Medieval mode
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Chỉ xử lý khi trang load hoàn tất và là GitHub
  if (
    changeInfo.status === 'complete' &&
    tab.url &&
    tab.url.includes('github.com')
  ) {
    handlePageLoaded(tabId);
  }
});
