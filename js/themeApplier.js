import { MEDIEVAL_TERMS } from './constants.js';

// Hàm thay đổi nội dung văn bản trên trang và thay thế icon SVG
export function applyMedievalTheme(node = document.body) {
  const walker = document.createTreeWalker(
    node,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  let textNode;

  while ((textNode = walker.nextNode())) {
    let text = textNode.nodeValue;
    let parent = textNode.parentElement.parentNode;

    Object.keys(MEDIEVAL_TERMS).forEach((original) => {
      if (text.includes(original)) {
        textNode.nodeValue = text.replace(original, MEDIEVAL_TERMS[original]);
        replaceSvgIcon(parent, original);
      }
    });
  }
}

function replaceSvgIcon(parent, original) {
  if (!parent) return;

  let svgElement = parent.querySelector('svg');
  if (svgElement && svgElement.parentNode === parent) {
    let newIcon = document.createElement('img');
    newIcon.src = chrome.runtime.getURL(
      `icon/${original.toLowerCase().replace(/\s+/g, '-')}.png`
    );
    newIcon.style.width = '16px';
    newIcon.style.height = '16px';
    newIcon.style.marginRight = '5px';

    parent.replaceChild(newIcon, svgElement);
  }
}
