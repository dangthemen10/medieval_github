import { redesignPinnedRepos } from './pinnedRepos.js';
import { applyMedievalTheme } from './themeApplier.js';
import { redesignProfileSection } from './profileSection.js';

// Hàm chờ element xuất hiện
function waitForElement(selector, callback, maxAttempts = 50) {
  let attempts = 0;

  const check = () => {
    const element = document.querySelector(selector);
    if (element) {
      callback(element);
      return;
    }

    attempts++;
    if (attempts < maxAttempts) {
      setTimeout(check, 100);
    } else {
      console.log(
        `Element ${selector} not found after ${maxAttempts} attempts`
      );
    }
  };

  check();
}

// Hàm khởi tạo theme
function initializeMedievalTheme() {
  console.log('Initializing Medieval GitHub Theme with Animated Flags...');

  applyMedievalTheme();
  redesignProfileSection();

  waitForElement('.js-pinned-items-reorder-container', () => {
    console.log('Pinned container found, applying animated flags redesign...');
    redesignPinnedRepos();
  });

  waitForElement('[data-testid="pinned-items"]', redesignPinnedRepos);
  waitForElement('.js-pinned-items-reorder-list', redesignPinnedRepos);
}

// Thiết lập MutationObserver
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList' || mutation.type === 'subtree') {
      applyMedievalTheme(mutation.target);

      if (
        mutation.target.querySelector &&
        mutation.target.querySelector('.js-pinned-items-reorder-container')
      ) {
        redesignPinnedRepos();
      }
    }
  });
});

// Khởi tạo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeMedievalTheme);
} else {
  initializeMedievalTheme();
}

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
