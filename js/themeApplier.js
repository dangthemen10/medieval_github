// themeApplier.js - Áp dụng medieval theme cho toàn trang

import { MEDIEVAL_TERMS } from './constants.js';
import { replaceSvgIcon, debounce, Logger } from './utils.js';

/**
 * Class quản lý việc áp dụng medieval theme
 */
export class ThemeApplier {
  constructor() {
    this.processedNodes = new WeakSet();
    this.debouncedApply = debounce(this.applyTheme.bind(this), 100);
  }

  /**
   * Áp dụng medieval theme cho một node
   * @param {Node} node - Node cần áp dụng theme
   */
  applyTheme(node = document.body) {
    if (this.processedNodes.has(node)) {
      return;
    }

    try {
      this.replaceTextContent(node);
      this.processedNodes.add(node);
    } catch (error) {
      Logger.error('Error applying theme to node:', error);
    }
  }

  /**
   * Thay thế nội dung text theo từ điển medieval
   * @param {Node} node - Node cần xử lý
   */
  replaceTextContent(node) {
    const walker = document.createTreeWalker(
      node,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (textNode) => {
          // Bỏ qua các node đã được xử lý hoặc trong script/style tags
          const parent = textNode.parentElement;
          if (
            !parent ||
            parent.tagName === 'SCRIPT' ||
            parent.tagName === 'STYLE' ||
            parent.hasAttribute('data-medieval-processed')
          ) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        },
      },
      false
    );

    const textNodes = [];
    let textNode;

    // Collect all text nodes first to avoid live NodeList issues
    while ((textNode = walker.nextNode())) {
      textNodes.push(textNode);
    }

    // Process each text node
    textNodes.forEach((node) => this.processTextNode(node));
  }

  /**
   * Xử lý một text node cụ thể
   * @param {Text} textNode - Text node cần xử lý
   */
  processTextNode(textNode) {
    let originalText = textNode.nodeValue;
    let modifiedText = originalText;
    let hasChanges = false;
    const parent = textNode.parentElement?.parentNode;

    // Thay thế từng thuật ngữ
    Object.entries(MEDIEVAL_TERMS).forEach(([original, medieval]) => {
      if (modifiedText.includes(original)) {
        modifiedText = modifiedText.replace(
          new RegExp(original, 'g'),
          medieval
        );
        hasChanges = true;

        // Thay thế SVG icon nếu có
        this.replaceSvgIconIfNeeded(parent, original);
      }
    });

    // Cập nhật text nếu có thay đổi
    if (hasChanges) {
      textNode.nodeValue = modifiedText;

      // Mark parent as processed
      if (textNode.parentElement) {
        textNode.parentElement.setAttribute('data-medieval-processed', 'true');
      }
    }
  }

  /**
   * Thay thế SVG icon nếu cần thiết
   * @param {Element} parent - Element cha
   * @param {string} original - Text gốc để xác định icon
   */
  replaceSvgIconIfNeeded(parent, original) {
    if (parent) {
      replaceSvgIcon(parent, original);
    }
  }

  /**
   * Áp dụng theme với debounce (dùng cho MutationObserver)
   * @param {Node} node - Node cần áp dụng theme
   */
  applyThemeDebounced(node) {
    this.debouncedApply(node);
  }

  /**
   * Áp dụng theme cho toàn bộ document
   */
  applyToDocument() {
    Logger.info('Applying medieval theme to document...');
    this.applyTheme(document.body);
  }

  /**
   * Reset processed nodes cache
   */
  resetCache() {
    this.processedNodes = new WeakSet();
  }

  /**
   * Kiểm tra xem một element có cần được xử lý không
   * @param {Element} element - Element cần kiểm tra
   * @returns {boolean}
   */
  shouldProcessElement(element) {
    return (
      element &&
      !element.hasAttribute('data-medieval-processed') &&
      !this.processedNodes.has(element)
    );
  }

  /**
   * Xử lý mutation từ MutationObserver
   * @param {MutationRecord[]} mutations - Danh sách mutations
   */
  processMutations(mutations) {
    const nodesToProcess = new Set();

    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            nodesToProcess.add(node);
          }
        });
      } else if (mutation.type === 'characterData') {
        if (mutation.target.parentElement) {
          nodesToProcess.add(mutation.target.parentElement);
        }
      }
    });

    // Process unique nodes
    nodesToProcess.forEach((node) => {
      if (this.shouldProcessElement(node)) {
        this.applyThemeDebounced(node);
      }
    });
  }
}
