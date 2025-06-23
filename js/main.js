import { redesignPinnedRepos } from './pinnedRepos.js';
import {
  applyMedievalTheme,
  cleanupTextAndIconChanges,
} from './themeApplier.js';
import { redesignProfileSection } from './profileSection.js';
import { cleanupMedieval, medievalTracker } from './tracking.js';
import { loadMedievalCSS, removeMedievalCSS } from './loadMedievalCss.js';

// ===== GLOBAL STATE =====
let isEnabled = false;
let observer = null;

// ===== UTILITY FUNCTIONS =====
/**
 * Waits for an element to appear in DOM
 * @param {string} selector - CSS selector
 * @param {function} callback - Function to call when element found
 * @param {number} maxAttempts - Maximum retry attempts
 */
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

// ===== THEME APPLICATION =====
/**
 * Applies medieval theme to the entire page
 */
function applyMedievalStyles() {
  console.log('🏰 Applying Medieval GitHub Theme...');

  // Load CSS first
  loadMedievalCSS();

  // Debug tracking status
  console.log(
    '📊 Tracking status before apply:',
    medievalTracker.getTrackingStatus()
  );

  // Apply theme components
  applyMedievalTheme();
  redesignProfileSection();

  // Wait for pinned repos container and apply redesign
  const pinnedSelectors = [
    '.js-pinned-items-reorder-container',
    '[data-testid="pinned-items"]',
    '.js-pinned-items-reorder-list',
  ];

  pinnedSelectors.forEach((selector) => {
    waitForElement(selector, () => {
      console.log(`${selector} found, applying animated flags redesign...`);
      redesignPinnedRepos();
    });
  });

  // Mark body as medieval mode active
  document.body.classList.add('medieval-mode');

  // Debug tracking status after apply
  setTimeout(() => {
    console.log(
      '📊 Tracking status after apply:',
      medievalTracker.getTrackingStatus()
    );
  }, 1000);
}

/**
 * Removes medieval theme using tracking system
 */
function removeMedievalStyles() {
  console.log('❌ Removing Medieval GitHub Theme...');

  // Debug tracking status before cleanup
  console.log(
    '📊 Tracking status before cleanup:',
    medievalTracker.getTrackingStatus()
  );

  // Remove CSS and body classes
  removeMedievalCSS();
  document.body.classList.remove('medieval-mode');

  // Use tracking system for cleanup
  cleanupMedieval();
  cleanupTextAndIconChanges();

  // Fallback cleanup for edge cases
  performFallbackCleanup();

  // Debug tracking status after cleanup
  setTimeout(() => {
    console.log(
      '📊 Tracking status after cleanup:',
      medievalTracker.getTrackingStatus()
    );
  }, 500);

  console.log('✅ Medieval theme removed successfully');
}

/**
 * Fallback cleanup for elements that might be missed by tracking
 */
function performFallbackCleanup() {
  try {
    // Define medieval-related selectors
    const medievalSelectors = [
      '.medieval-flag',
      '.medieval-banner',
      '.medieval-decoration',
      '.medieval-overlay',
      '.medieval-border',
      '.parchment-bg',
      '.ancient-scroll',
      '.castle-icon',
      '.knight-avatar',
      '[class*="medieval"]',
      '[class*="parchment"]',
      '[class*="ancient"]',
      '[class*="castle"]',
      '[class*="knight"]',
    ];

    // Clean up untracked medieval classes
    medievalSelectors.forEach((selector) => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
          // Only clean if not tracked by our system
          if (
            !element.dataset.medievalCreated &&
            !element.dataset.medievalModified
          ) {
            cleanMedievalClasses(element);
          }
        });
      } catch (e) {
        console.warn(`Could not process selector ${selector}:`, e);
      }
    });

    // Clean up inline styles with medieval content
    cleanMedievalInlineStyles();

    // Remove medieval data attributes and icons
    cleanMedievalDataAttributes();
  } catch (error) {
    console.error('❌ Error in fallback cleanup:', error);
  }
}

/**
 * Removes medieval-related CSS classes from element
 */
function cleanMedievalClasses(element) {
  const medievalKeywords = [
    'medieval',
    'parchment',
    'ancient',
    'castle',
    'knight',
  ];
  const classes = Array.from(element.classList);

  classes.forEach((className) => {
    if (medievalKeywords.some((keyword) => className.includes(keyword))) {
      element.classList.remove(className);
    }
  });
}

/**
 * Cleans up medieval-related inline styles
 */
function cleanMedievalInlineStyles() {
  const styledElements = document.querySelectorAll('[style]');

  styledElements.forEach((element) => {
    // Skip tracked elements
    if (element.dataset.medievalCreated || element.dataset.medievalModified)
      return;

    if (element.style.cssText) {
      const originalStyle = element.style.cssText;
      let newStyle = originalStyle;

      // Define medieval CSS patterns to remove
      const medievalPatterns = [
        /background[^;]*medieval[^;]*;?/gi,
        /background[^;]*parchment[^;]*;?/gi,
        /background[^;]*ancient[^;]*;?/gi,
        /color[^;]*parchment[^;]*;?/gi,
        /font[^;]*ancient[^;]*;?/gi,
        /border[^;]*medieval[^;]*;?/gi,
        /box-shadow[^;]*medieval[^;]*;?/gi,
        /text-shadow[^;]*medieval[^;]*;?/gi,
        /background-image[^;]*url\([^)]*medieval[^)]*\)[^;]*;?/gi,
        /background-image[^;]*url\([^)]*castle[^)]*\)[^;]*;?/gi,
        /background-image[^;]*url\([^)]*knight[^)]*\)[^;]*;?/gi,
      ];

      // Remove medieval patterns
      medievalPatterns.forEach((pattern) => {
        newStyle = newStyle.replace(pattern, '');
      });

      // Update or remove style attribute
      newStyle = newStyle.trim();
      if (newStyle === '' || newStyle === ';') {
        element.removeAttribute('style');
      } else if (newStyle !== originalStyle) {
        element.style.cssText = newStyle;
      }
    }
  });
}

/**
 * Cleans up medieval data attributes and icons
 */
function cleanMedievalDataAttributes() {
  // Remove dynamically added CSS rules
  const styleSheets = document.querySelectorAll('style[data-medieval="true"]');
  styleSheets.forEach((sheet) => sheet.remove());

  // Clean up untracked medieval data attributes
  const elementsWithMedievalData = document.querySelectorAll(
    '[data-medieval], [data-original-content], [data-original-class]'
  );
  elementsWithMedievalData.forEach((element) => {
    if (!element.dataset.medievalId) {
      element.removeAttribute('data-medieval');
      element.removeAttribute('data-original-content');
      element.removeAttribute('data-original-class');
    }
  });

  // Remove text processing markers
  const processedElements = document.querySelectorAll(
    '[data-medieval-text-processed="true"]'
  );
  processedElements.forEach((element) => {
    element.removeAttribute('data-medieval-text-processed');
  });

  // Remove medieval icons
  const medievalIcons = document.querySelectorAll(
    '[data-medieval-icon="true"]'
  );
  medievalIcons.forEach((icon) => {
    try {
      if (icon.parentNode) {
        icon.parentNode.removeChild(icon);
      }
    } catch (e) {
      console.warn('Error removing medieval icon:', e);
    }
  });
}

// ===== INITIALIZATION =====
/**
 * Initializes medieval theme if enabled
 */
function initializeMedievalTheme() {
  if (isEnabled) {
    console.log('🎯 Initializing Medieval Theme...');
    applyMedievalStyles();
  }
}

/**
 * Sets up MutationObserver with tracking-aware logic
 */
function setupObserver() {
  if (observer) {
    observer.disconnect();
  }

  observer = new MutationObserver((mutations) => {
    // Only observe when medieval mode is enabled
    if (!isEnabled) return;

    let shouldReapply = false;

    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        // Check if tracked elements were removed
        mutation.removedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const trackedElements = node.querySelectorAll
              ? node.querySelectorAll(
                  '[data-medieval-created], [data-medieval-modified]'
                )
              : [];

            if (
              trackedElements.length > 0 ||
              node.dataset?.medievalCreated ||
              node.dataset?.medievalModified
            ) {
              console.log('🔄 Tracked element removed, may need reapply');
              shouldReapply = true;
            }
          }
        });

        // Check if new GitHub elements were added
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE && node.querySelector) {
            if (node.querySelector('.js-pinned-items-reorder-container')) {
              console.log('🔄 Pinned container added, reapplying...');
              setTimeout(() => redesignPinnedRepos(), 100);
            }
          }
        });
      }
    });

    // Reapply theme if needed
    if (shouldReapply) {
      setTimeout(() => {
        console.log('🔄 Reapplying medieval theme due to DOM changes...');
        applyMedievalTheme();
      }, 100);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

// ===== MESSAGE HANDLING =====
/**
 * Enhanced message listener with tracking info
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('📨 Content script received message:', message);

  switch (message.action) {
    case 'applyMedievalMode':
    case 'toggleMedieval':
      handleToggleMedieval(message);
      break;

    case 'getState':
      sendResponse({
        enabled: isEnabled,
        tracking: medievalTracker.getTrackingStatus(),
      });
      break;

    case 'getTrackingInfo':
      sendResponse(medievalTracker.getTrackingStatus());
      break;

    case 'forceCleanup':
      console.log('🧹 Force cleanup requested...');
      cleanupMedieval();
      removeMedievalCSS();
      sendResponse({ success: true });
      break;
  }
});

/**
 * Handles toggle medieval mode message
 */
function handleToggleMedieval(message) {
  const wasEnabled = isEnabled;
  isEnabled = message.enabled;

  if (isEnabled && !wasEnabled) {
    console.log('🏰 Enabling Medieval Mode...');
    applyMedievalStyles();
    setupObserver();
  } else if (!isEnabled && wasEnabled) {
    console.log('❌ Disabling Medieval Mode...');
    removeMedievalStyles();
    if (observer) {
      observer.disconnect();
    }
  }
}

// ===== STATE MANAGEMENT =====
/**
 * Loads initial state from Chrome storage
 */
async function loadInitialState() {
  try {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.get(['medievalEnabled'], (result) => {
        const previousEnabled = isEnabled;
        isEnabled = result.medievalEnabled || false;

        console.log('🔄 Loaded state from storage:', isEnabled);

        if (isEnabled) {
          initializeMedievalTheme();
          setupObserver();
        } else if (previousEnabled) {
          removeMedievalStyles();
        }
      });
    } else {
      console.log('⚠️ Chrome storage not available, defaulting to disabled');
      isEnabled = false;
    }
  } catch (error) {
    console.error('❌ Error loading initial state:', error);
    isEnabled = false;
  }
}

/**
 * Notifies background script that page has loaded
 */
function notifyPageLoaded() {
  try {
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      chrome.runtime.sendMessage({
        action: 'pageLoaded',
        url: window.location.href,
        tracking: medievalTracker.getTrackingStatus(),
      });
    }
  } catch (error) {
    console.log('Could not notify background script:', error);
  }
}

/**
 * Main initialization function
 */
function initialize() {
  console.log('🚀 Medieval GitHub Extension initializing...');
  console.log(
    '📊 Initial tracking status:',
    medievalTracker.getTrackingStatus()
  );

  loadInitialState();
  notifyPageLoaded();
  setupObserver();

  // Setup cleanup on page visibility change
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && !isEnabled) {
      cleanupMedieval();
      removeMedievalCSS();
    }
  });
}

// ===== EVENT LISTENERS =====
// Cleanup when page unloads
window.addEventListener('beforeunload', () => {
  console.log('🔄 Page unloading, performing cleanup...');

  if (observer) {
    observer.disconnect();
  }

  // Cleanup tracking if not enabled
  if (!isEnabled) {
    cleanupMedieval();
    removeMedievalCSS();
  }
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}

// ===== GLOBAL EXPORTS =====
// Export functions for debugging and external access
if (typeof window !== 'undefined') {
  window.medievalGithub = {
    applyMedievalStyles,
    removeMedievalStyles,
    loadMedievalCSS,
    removeMedievalCSS,
    isEnabled: () => isEnabled,
    getTrackingStatus: () => medievalTracker.getTrackingStatus(),
    forceCleanup: () => {
      cleanupMedieval();
      removeMedievalCSS();
    },
    tracker: medievalTracker,
  };
}
