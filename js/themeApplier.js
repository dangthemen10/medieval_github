import { MEDIEVAL_TERMS } from './constants.js';
import { trackModified } from './tracking.js';
import { getResourceUrl } from './utils.js';

/**
 * Áp dụng theme medieval cho text và icons trên trang
 * @param {Node} node - Node gốc để bắt đầu xử lý (mặc định: document.body)
 */
export function applyMedievalTheme(node = document.body) {
  // Lấy tất cả text nodes và xử lý chúng
  getTextNodes(node).forEach(processTextNode);
}

/**
 * Lấy tất cả text nodes từ node gốc
 * @param {Node} node - Node gốc để tìm kiếm
 * @returns {Node[]} Mảng các text nodes
 */
function getTextNodes(node) {
  const textNodes = [];
  const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);

  let textNode;
  while ((textNode = walker.nextNode())) {
    textNodes.push(textNode);
  }

  return textNodes;
}

/**
 * Xử lý một text node để thay thế text medieval
 * @param {Node} textNode - Text node cần xử lý
 */
function processTextNode(textNode) {
  const parent = textNode.parentElement;

  // Bỏ qua nếu đã được xử lý hoặc parent null
  if (!parent || parent.dataset.medievalTextProcessed === 'true') return;

  const originalText = textNode.nodeValue;
  const medievalText = applyTextReplacements(originalText);

  // Chỉ xử lý nếu text thực sự thay đổi
  if (originalText === medievalText) return;

  // Track và cập nhật
  trackModified(parent, { innerHTML: parent.innerHTML, originalText });
  textNode.nodeValue = medievalText;

  // Thay thế SVG icons liên quan
  replaceRelatedSvgIcons(parent.parentNode, originalText);

  // Đánh dấu đã xử lý
  parent.dataset.medievalTextProcessed = 'true';
}

/**
 * Áp dụng các thay thế text medieval cho string
 * @param {string} text - Text gốc
 * @returns {string} Text đã được thay thế
 */
function applyTextReplacements(text) {
  let result = text;

  // Thay thế tất cả terms trong MEDIEVAL_TERMS
  Object.entries(MEDIEVAL_TERMS).forEach(([original, medieval]) => {
    if (result.includes(original)) {
      result = result.replace(new RegExp(original, 'g'), medieval);
    }
  });

  return result;
}

/**
 * Thay thế SVG icons liên quan đến các terms đã thay đổi
 * @param {Element} parent - Element cha để tìm SVGs
 * @param {string} originalText - Text gốc để kiểm tra terms
 */
function replaceRelatedSvgIcons(parent, originalText) {
  if (!parent) return;

  // Tìm các terms có trong text gốc và thay thế SVG tương ứng
  Object.keys(MEDIEVAL_TERMS)
    .filter((term) => originalText.includes(term))
    .forEach((term) => replaceSvgIcon(parent, term));
}

/**
 * Thay thế SVG icon bằng image medieval
 * @param {Element} parent - Element cha chứa SVG
 * @param {string} term - Term kích hoạt việc thay thế
 */
function replaceSvgIcon(parent, term) {
  const svgElement = parent.querySelector('svg');
  if (!svgElement || svgElement.parentNode !== parent) return;

  // Track trước khi thay đổi
  trackModified(parent, {
    innerHTML: parent.innerHTML,
    iconReplacement: { term, originalSvg: svgElement.outerHTML },
  });

  // Tạo và thay thế icon medieval
  const medievalIcon = createMedievalIcon(term);
  parent.replaceChild(medievalIcon, svgElement);
}

/**
 * Tạo element icon medieval
 * @param {string} term - Term để tạo icon
 * @returns {HTMLImageElement} Element icon medieval
 */
function createMedievalIcon(term) {
  const icon = document.createElement('img');
  const iconPath = term.toLowerCase().replace(/\s+/g, '-');

  // Icon configuration
  icon.src = getResourceUrl(`assets/icon/${iconPath}.png`);
  icon.style.cssText = 'width: 16px; height: 16px; margin-right: 5px;';
  icon.dataset.medievalIcon = 'true';
  icon.dataset.originalTerm = term;

  return icon;
}

/**
 * Khôi phục nội dung gốc cho element cụ thể
 * @param {Element} element - Element cần khôi phục
 * @returns {boolean} Trạng thái thành công
 */
export function restoreOriginalContent(element) {
  try {
    // Xóa marker đã xử lý
    delete element.dataset.medievalTextProcessed;
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Cleanup toàn diện cho tất cả thay đổi text và icon
 * Đây là fallback phòng trường hợp tracking system bỏ sót
 */
export function cleanupTextAndIconChanges() {
  try {
    // Cleanup các elements đã được xử lý
    document
      .querySelectorAll('[data-medieval-text-processed="true"]')
      .forEach(restoreOriginalContent);

    // Fallback: reverse text replacements thủ công
    performFallbackTextCleanup();
  } catch (error) {
    console.error('[MedievalTheme] Error in cleanup:', error);
  }
}

/**
 * Thực hiện fallback cleanup bằng cách reverse medieval terms
 * Safety net phòng trường hợp tracking system bỏ sót
 */
function performFallbackTextCleanup() {
  // Tạo reverse mapping: medieval -> original
  const reverseTerms = Object.fromEntries(
    Object.entries(MEDIEVAL_TERMS).map(([original, medieval]) => [
      medieval,
      original,
    ])
  );

  // Reverse tất cả text nodes
  getTextNodes(document.body).forEach((textNode) => {
    const originalText = textNode.nodeValue;
    let restoredText = originalText;

    // Thay thế ngược lại từ medieval về original
    Object.entries(reverseTerms).forEach(([medieval, original]) => {
      if (restoredText.includes(medieval)) {
        restoredText = restoredText.replace(
          new RegExp(medieval, 'g'),
          original
        );
      }
    });

    // Cập nhật nếu có thay đổi
    if (originalText !== restoredText) {
      textNode.nodeValue = restoredText;
    }
  });
}
