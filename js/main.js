// main.js - File chính của Medieval GitHub Theme Extension

import { SELECTORS, CONFIG } from './constants.js';
import { waitForElement, Logger } from './utils.js';
import { ThemeApplier } from './themeApplier.js';
import { PinnedReposManager } from './pinnedRepos.js';

/**
 * Class chính quản lý toàn bộ extension
 */
class MedievalGitHubTheme {
  constructor() {
    this.themeApplier = new ThemeApplier();
    this.pinnedReposManager = new PinnedReposManager();
    this.mutationObserver = null;
    this.isInitialized = false;
  }

  /**
   * Khởi tạo theme
   */
  async init() {
    if (this.isInitialized) {
      Logger.warn('Theme already initialized');
      return;
    }

    Logger.info('Initializing Medieval GitHub Theme...');

    try {
      // Áp dụng theme cho toàn bộ document
      this.themeApplier.applyToDocument();

      // Khởi tạo pinned repositories redesign
      await this.initPinnedRepos();

      // Setup MutationObserver
      this.setupMutationObserver();

      this.isInitialized = true;
      Logger.info('Medieval GitHub Theme initialized successfully!');
    } catch (error) {
      Logger.error('Failed to initialize theme:', error);
    }
  }

  /**
   * Khởi tạo pinned repositories với retry logic
   */
  async initPinnedRepos() {
    const selectors = [
      SELECTORS.PINNED_CONTAINER,
      SELECTORS.PINNED_ITEMS,
      SELECTORS.PINNED_LIST,
    ];

    // Thử từng selector
    for (const selector of selectors) {
      try {
        await waitForElement(
          selector,
          CONFIG.MAX_WAIT_ATTEMPTS,
          CONFIG.WAIT_INTERVAL
        );
        Logger.info(`Found pinned element with selector: ${selector}`);

        if (this.pinnedReposManager.redesign()) {
          return; // Thành công, dừng thử các selector khác
        }
      } catch (error) {
        Logger.warn(`Element not found with selector: ${selector}`);
      }
    }

    Logger.warn('Could not find any pinned repositories elements');
  }

  /**
   * Setup MutationObserver để theo dõi thay đổi DOM
   */
  setupMutationObserver() {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }

    this.mutationObserver = new MutationObserver((mutations) => {
      // Xử lý theme changes
      this.themeApplier.processMutations(mutations);

      // Kiểm tra pinned repos changes
      this.handlePinnedReposMutations(mutations);
    });

    this.mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: false,
    });

    Logger.info('MutationObserver setup completed');
  }

  /**
   * Xử lý mutations liên quan đến pinned repositories
   */
  handlePinnedReposMutations(mutations) {
    let shouldCheckPinnedRepos = false;

    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Kiểm tra xem có element pinned repos mới không
            if (
              node.querySelector &&
              (node.querySelector(SELECTORS.PINNED_CONTAINER) ||
                node.matches?.(SELECTORS.PINNED_CONTAINER))
            ) {
              shouldCheckPinnedRepos = true;
            }
          }
        });
      }
    });

    if (shouldCheckPinnedRepos || this.pinnedReposManager.needsRedesign()) {
      Logger.info('Detected pinned repos changes, attempting redesign...');
      this.pinnedReposManager.redesign();
    }
  }

  /**
   * Cleanup và destroy
   */
  destroy() {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = null;
    }

    if (this.pinnedReposManager) {
      this.pinnedReposManager.reset();
    }

    this.isInitialized = false;
    Logger.info('Medieval theme destroyed');
  }

  /**
   * Refresh theme - useful for debugging
   */
  refresh() {
    Logger.info('Refreshing medieval theme...');
    this.themeApplier.resetCache();
    this.pinnedReposManager.reset();
    this.init();
  }
}

// Instance chính của theme
const medievalTheme = new MedievalGitHubTheme();

// Khởi tạo khi DOM ready
function initializeWhenReady() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => medievalTheme.init(), 100);
    });
  } else {
    // DOM đã sẵn sàng
    setTimeout(() => medievalTheme.init(), 100);
  }
}

// Khởi tạo theme
initializeWhenReady();

// Expose cho debugging (chỉ trong development)
if (typeof window !== 'undefined') {
  window.medievalTheme = medievalTheme;
}

// Cleanup khi unload
window.addEventListener('beforeunload', () => {
  medievalTheme.destroy();
});

// Export cho testing (nếu cần)
export default medievalTheme;
