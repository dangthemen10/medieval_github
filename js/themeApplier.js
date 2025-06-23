import { MEDIEVAL_TERMS } from './constants.js';
import { trackModified } from './tracking.js';

/**
 * Main function to apply medieval theme to text and icons on the page
 * @param {Node} node - The root node to start processing from (default: document.body)
 */
export function applyMedievalTheme(node = document.body) {
  console.log('[MedievalTheme] Applying theme with tracking support...');

  const textNodes = getTextNodes(node);

  textNodes.forEach((textNode) => {
    processTextNode(textNode);
  });
}

/**
 * Get all text nodes from a given root node
 * @param {Node} node - Root node to search
 * @returns {Node[]} Array of text nodes
 */
function getTextNodes(node) {
  const textNodes = [];
  const walker = document.createTreeWalker(
    node,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  let textNode;
  while ((textNode = walker.nextNode())) {
    textNodes.push(textNode);
  }

  return textNodes;
}

/**
 * Process a single text node for medieval text replacements
 * @param {Node} textNode - Text node to process
 */
function processTextNode(textNode) {
  const parent = textNode.parentElement;

  // Skip if already processed or parent is null
  if (!parent || parent.dataset.medievalTextProcessed === 'true') {
    return;
  }

  const originalText = textNode.nodeValue;
  const medievalText = applyTextReplacements(originalText);

  // Only proceed if text actually changed
  if (originalText === medievalText) {
    return;
  }

  // Track parent element before making changes
  trackParentElement(parent, originalText);

  // Update text content
  textNode.nodeValue = medievalText;

  // Handle SVG icon replacements for changed terms
  replaceRelatedSvgIcons(parent.parentNode, originalText);

  // Mark as processed
  parent.dataset.medievalTextProcessed = 'true';

  console.log(`[MedievalTheme] Text replaced in element: ${parent.tagName}`);
}

/**
 * Apply medieval text replacements to a string
 * @param {string} text - Original text
 * @returns {string} Text with medieval replacements
 */
function applyTextReplacements(text) {
  let modifiedText = text;

  Object.entries(MEDIEVAL_TERMS).forEach(([original, medieval]) => {
    if (modifiedText.includes(original)) {
      modifiedText = modifiedText.replace(new RegExp(original, 'g'), medieval);
    }
  });

  return modifiedText;
}

/**
 * Track parent element state before modification
 * @param {Element} parent - Parent element to track
 * @param {string} originalText - Original text content
 */
function trackParentElement(parent, originalText) {
  trackModified(parent, {
    innerHTML: parent.innerHTML, // Save original HTML content
    originalText: originalText, // Save original text for this specific node
  });
}

/**
 * Replace SVG icons related to changed terms
 * @param {Element} parent - Parent element to search for SVGs
 * @param {string} originalText - Original text to check for terms
 */
function replaceRelatedSvgIcons(parent, originalText) {
  if (!parent) return;

  // Check which terms were present in original text
  const presentTerms = Object.keys(MEDIEVAL_TERMS).filter((term) =>
    originalText.includes(term)
  );

  presentTerms.forEach((term) => {
    replaceSvgIcon(parent, term);
  });
}

/**
 * Replace SVG icon with medieval-themed image
 * @param {Element} parent - Parent element containing SVG
 * @param {string} term - Term that triggered the replacement
 */
function replaceSvgIcon(parent, term) {
  const svgElement = parent.querySelector('svg');

  if (!svgElement || svgElement.parentNode !== parent) {
    return;
  }

  // Track parent before making changes
  trackModified(parent, {
    innerHTML: parent.innerHTML,
    iconReplacement: {
      term: term,
      originalSvg: svgElement.outerHTML,
    },
  });

  // Create and configure new medieval icon
  const medievalIcon = createMedievalIcon(term);

  // Replace SVG with new icon
  parent.replaceChild(medievalIcon, svgElement);

  console.log(`[MedievalTheme] SVG icon replaced for term: ${term}`);
}

/**
 * Create a medieval-themed icon element
 * @param {string} term - Term to create icon for
 * @returns {HTMLImageElement} Medieval icon element
 */
function createMedievalIcon(term) {
  const icon = document.createElement('img');
  const iconPath = term.toLowerCase().replace(/\s+/g, '-');

  icon.src = chrome.runtime.getURL(`icon/${iconPath}.png`);
  icon.style.cssText = `
    width: 16px;
    height: 16px;
    margin-right: 5px;
  `;
  icon.dataset.medievalIcon = 'true';
  icon.dataset.originalTerm = term;

  return icon;
}

/**
 * Restore original content for a specific element
 * @param {Element} element - Element to restore
 * @returns {boolean} Success status
 */
export function restoreOriginalContent(element) {
  try {
    // Remove text processing marker
    if (element.dataset.medievalTextProcessed) {
      delete element.dataset.medievalTextProcessed;
    }

    // Clean up medieval icons (actual restoration handled by tracking system)
    const medievalIcons = element.querySelectorAll(
      '[data-medieval-icon="true"]'
    );
    medievalIcons.forEach((icon) => {
      const originalTerm = icon.dataset.originalTerm;
      if (originalTerm) {
        console.log(
          `[MedievalTheme] Cleaning up medieval icon for: ${originalTerm}`
        );
      }
    });

    return true;
  } catch (error) {
    console.error('[MedievalTheme] Error restoring content:', error);
    return false;
  }
}

/**
 * Comprehensive cleanup function for all text and icon changes
 * This serves as a fallback in case the tracking system misses anything
 */
export function cleanupTextAndIconChanges() {
  console.log('[MedievalTheme] Cleaning up text and icon changes...');

  try {
    // Clean up processed elements
    cleanupProcessedElements();

    // Clean up medieval icons
    cleanupMedievalIcons();

    // Fallback: reverse any remaining text replacements
    performFallbackTextCleanup();
  } catch (error) {
    console.error('[MedievalTheme] Error in text/icon cleanup:', error);
  }
}

/**
 * Clean up elements marked as processed
 */
function cleanupProcessedElements() {
  const processedElements = document.querySelectorAll(
    '[data-medieval-text-processed="true"]'
  );
  processedElements.forEach((element) => {
    restoreOriginalContent(element);
  });
}

/**
 * Clean up medieval icons from the page
 */
function cleanupMedievalIcons() {
  const medievalIcons = document.querySelectorAll(
    '[data-medieval-icon="true"]'
  );
  console.log(
    `[MedievalTheme] Found ${medievalIcons.length} medieval icons to clean up`
  );

  // Icons will be restored via tracking system, this is just for logging
}

/**
 * Perform fallback text cleanup by reversing medieval terms
 * This is a safety net in case the tracking system missed some changes
 */
function performFallbackTextCleanup() {
  const reverseMedievalTerms = createReverseMedievalTermsMap();
  const textNodes = getTextNodes(document.body);

  textNodes.forEach((textNode) => {
    const originalText = textNode.nodeValue;
    const restoredText = reverseTextReplacements(
      originalText,
      reverseMedievalTerms
    );

    if (originalText !== restoredText) {
      textNode.nodeValue = restoredText;
      console.log(
        '[MedievalTheme] Reversed text replacements in fallback cleanup'
      );
    }
  });
}

/**
 * Create a reverse mapping of medieval terms to original terms
 * @returns {Object} Reverse mapping object
 */
function createReverseMedievalTermsMap() {
  const reverseMedievalTerms = {};

  Object.entries(MEDIEVAL_TERMS).forEach(([original, medieval]) => {
    reverseMedievalTerms[medieval] = original;
  });

  return reverseMedievalTerms;
}

/**
 * Reverse medieval text replacements back to original terms
 * @param {string} text - Text with medieval terms
 * @param {Object} reverseMedievalTerms - Reverse mapping of terms
 * @returns {string} Text with original terms restored
 */
function reverseTextReplacements(text, reverseMedievalTerms) {
  let restoredText = text;

  Object.entries(reverseMedievalTerms).forEach(([medieval, original]) => {
    if (restoredText.includes(medieval)) {
      restoredText = restoredText.replace(new RegExp(medieval, 'g'), original);
    }
  });

  return restoredText;
}
