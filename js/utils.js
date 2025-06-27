/**
 * Hàm chờ element xuất hiện với Promise
 * @param {string} selector - CSS selector
 * @param {number} maxAttempts - Số lần thử tối đa
 * @param {number} interval - Khoảng thời gian giữa các lần thử
 * @returns {Promise<Element>}
 */
export function waitForElement(selector, maxAttempts = 50, interval = 100) {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    const check = () => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }

      attempts++;
      if (attempts >= maxAttempts) {
        reject(
          new Error(
            `Element ${selector} not found after ${maxAttempts} attempts`
          )
        );
        return;
      }

      setTimeout(check, interval);
    };

    check();
  });
}

/**
 * Hàm thay thế SVG icon
 * @param {Element} parent - Element cha chứa SVG
 * @param {string} original - Tên gốc để tạo tên file icon
 */
export function replaceSvgIcon(parent, original) {
  if (!parent) return;

  const svgElement = parent.querySelector('svg');
  if (svgElement && svgElement.parentNode === parent) {
    const newIcon = document.createElement('img');
    newIcon.src = getResourceUrl(`assets/icon/${original.toLowerCase()}.png`);
    newIcon.style.width = '16px';
    newIcon.style.height = '16px';
    newIcon.style.marginRight = '5px';

    parent.replaceChild(newIcon, svgElement);
  }
}

/**
 * Hàm tạo và inject CSS styles
 * @param {string} id - ID của style element
 * @param {string} cssText - Nội dung CSS
 */
export function injectStyles(id, cssText) {
  if (document.querySelector(`#${id}`)) return;

  const style = document.createElement('style');
  style.id = id;
  style.textContent = cssText;
  document.head.appendChild(style);
}

/**
 * Hàm lấy thông tin repository từ DOM element
 * @param {Element} item - DOM element của repository item
 * @returns {Object} Thông tin repository
 */
export function extractRepoInfo(item) {
  const repoLink = item.querySelector('.Link.text-bold');
  const description = item.querySelector('.pinned-item-desc');
  const language = item.querySelector('[itemprop="programmingLanguage"]');
  const stars = item.querySelector('a[href*="/stargazers"]');
  const forks = item.querySelector('a[href*="/forks"]');

  return {
    name: repoLink ? repoLink.textContent.trim() : 'Unknown',
    description: description ? description.textContent.trim() : '',
    language: language ? language.textContent.trim() : '',
    stars: stars ? stars.textContent.trim() : '0',
    forks: forks ? forks.textContent.trim() : '0',
    url: repoLink ? repoLink.href : '#',
  };
}

/**
 * Hàm tạo URL cho resource
 * @param {string} path - Đường dẫn tới resource
 * @returns {string} URL đầy đủ
 */
export function getResourceUrl(path) {
  return chrome.runtime.getURL(path);
}

/**
 * Hàm debounce để tránh gọi hàm quá nhiều lần
 * @param {Function} func - Hàm cần debounce
 * @param {number} wait - Thời gian chờ (ms)
 * @returns {Function}
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Logger utility cho debugging
 */
export const Logger = {
  info: (message, ...args) => {
    console.log(`[Medieval Theme] ${message}`, ...args);
  },
  warn: (message, ...args) => {
    console.warn(`[Medieval Theme] ${message}`, ...args);
  },
  error: (message, ...args) => {
    console.error(`[Medieval Theme] ${message}`, ...args);
  },
};
