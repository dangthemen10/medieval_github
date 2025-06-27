export class MedievalTracker {
  constructor() {
    this.modifications = new Map();
    this.createdElements = new Set();
    this.placeholders = new Map(); // ✅ NEW: Track placeholders
    this.originalStyles = new Map();
    this.originalContent = new Map();
    this.originalAttributes = new Map();
  }

  // Track element được tạo mới
  trackCreatedElement(element, identifier = null) {
    const id = identifier || this.generateElementId(element);
    element.dataset.medievalCreated = 'true';
    element.dataset.medievalId = id;
    this.createdElements.add(element);

    return id;
  }

  // ✅ Also enhance the trackModifiedElement method to store extra data
  trackModifiedElement(element, originalData = {}) {
    if (element.dataset.medievalModified === 'true') {
      return element.dataset.medievalId;
    }

    const id = this.generateElementId(element);
    element.dataset.medievalModified = 'true';
    element.dataset.medievalId = id;

    // ✅ Enhanced data storage
    const modification = {
      element: element,
      originalClassName:
        originalData.className !== undefined
          ? originalData.className
          : element.className,
      originalStyle:
        originalData.style !== undefined
          ? originalData.style
          : element.style.cssText,
      originalContent:
        originalData.innerHTML !== undefined
          ? originalData.innerHTML
          : element.innerHTML && element.innerHTML.length < 2000
          ? element.innerHTML
          : null,
      originalAttributes: this.getElementAttributes(element),
      originalParent: originalData.originalParent || element.parentNode,
      originalNextSibling:
        originalData.originalNextSibling || element.nextSibling,
      placeholder: originalData.placeholder || null,
      wasMoved: false,

      // Store additional restoration data
      originalDisplay: originalData.originalDisplay || null,
      displayProperty: originalData.displayProperty || null,
    };

    this.modifications.set(id, modification);

    return id;
  }

  // Track khi element bị di chuyển
  trackElementMove(element, fromParent, toParent) {
    const id = element.dataset.medievalId;
    if (id && this.modifications.has(id)) {
      const modification = this.modifications.get(id);
      modification.wasMoved = true;
      modification.movedFromParent = fromParent;
      modification.movedToParent = toParent;
    }
  }

  // Track style changes
  trackStyleChange(element, property, originalValue, newValue) {
    const id = element.dataset.medievalId || this.generateElementId(element);
    if (!this.originalStyles.has(id)) {
      this.originalStyles.set(id, new Map());
    }

    const elementStyles = this.originalStyles.get(id);
    if (!elementStyles.has(property)) {
      elementStyles.set(property, originalValue);
    }
  }

  // Generate unique ID cho element
  generateElementId(element) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    const tagName = element.tagName.toLowerCase();

    // Safe way to get className as a string
    let className = '';
    if (element.className) {
      // Handle both string and SVGAnimatedString cases
      const classNameStr =
        typeof element.className === 'string'
          ? element.className
          : element.className.baseVal || element.className.toString();
      className = classNameStr.split(' ')[0] || '';
    }

    return `medieval_${tagName}_${className}_${timestamp}_${random}`;
  }

  // Lấy tất cả attributes của element
  getElementAttributes(element) {
    const attrs = {};
    for (let i = 0; i < element.attributes.length; i++) {
      const attr = element.attributes[i];
      attrs[attr.name] = attr.value;
    }
    return attrs;
  }

  // Add this method to MedievalTracker class
  restoreModifiedElement(elementId) {
    const modification = this.modifications.get(elementId);
    if (!modification) {
      return false;
    }

    const {
      element,
      originalClassName,
      originalStyle,
      originalContent,
      originalAttributes,
      originalParent,
      originalNextSibling,
      placeholder,
      wasMoved,
      computedDisplay,
      computedVisibility,
      computedOpacity,
      inlineDisplay,
      inlineVisibility,
      inlineOpacity,
      medievalHidden,
      originalDisplayState,
    } = modification;

    try {
      if (placeholder && document.contains(placeholder)) {
        placeholder.parentNode.insertBefore(element, placeholder);
        placeholder.remove();
        this.placeholders.delete(elementId);
      } else if (
        wasMoved &&
        originalParent &&
        originalParent !== element.parentNode
      ) {
        if (document.contains(originalParent)) {
          if (originalNextSibling && document.contains(originalNextSibling)) {
            originalParent.insertBefore(element, originalNextSibling);
          } else {
            originalParent.appendChild(element);
          }
        }
      }

      if (originalContent !== null && originalContent !== undefined) {
        element.innerHTML = originalContent;
      }

      if (originalClassName !== undefined) {
        element.className = originalClassName;
      }

      // Enhanced style restoration
      if (originalStyle !== undefined) {
        // Clear all current styles first
        element.style.cssText = '';

        // Apply original style
        if (originalStyle) {
          element.style.cssText = originalStyle;
        }
      }

      // Special handling cho vcard-names-container và elements bị ẩn
      if (
        element.classList.contains('vcard-names-container') ||
        medievalHidden
      ) {
        // Remove medieval data attributes first
        delete element.dataset.medievalHidden;
        delete element.dataset.medievalOriginalDisplay;
        delete element.dataset.medievalOriginalVisibility;
        delete element.dataset.medievalOriginalOpacity;

        if (originalDisplayState && computedDisplay) {
          // Restore to original computed display if it was visible
          if (computedDisplay !== 'none') {
            element.style.display = inlineDisplay || '';
          }
        } else {
          // Default restoration
          element.style.display = inlineDisplay || '';
        }

        // Restore visibility and opacity
        element.style.visibility = inlineVisibility || '';
        element.style.opacity = inlineOpacity || '';

        element.offsetHeight; // Trigger reflow

        const afterRestoreStyle = window.getComputedStyle(element);

        if (afterRestoreStyle.display === 'none' && originalDisplayState) {
          element.style.display = computedDisplay || 'block';
          element.style.visibility = computedVisibility || 'visible';
          element.style.opacity = computedOpacity || '1';
        }
      }

      if (originalAttributes) {
        Object.keys(originalAttributes).forEach((attrName) => {
          if (!attrName.startsWith('data-medieval')) {
            try {
              element.setAttribute(attrName, originalAttributes[attrName]);
            } catch (e) {
              console.warn(`Could not restore attribute ${attrName}:`, e);
            }
          }
        });
      }

      delete element.dataset.medievalModified;
      delete element.dataset.medievalId;

      this.modifications.delete(elementId);

      return true;
    } catch (error) {
      console.error(
        `[MedievalTracker] Error restoring element ${elementId}:`,
        error
      );
      return false;
    }
  }

  findBestParentForElement(element) {
    // Priority order for GitHub elements
    const potentialParents = [
      'main',
      '.application-main',
      '[role="main"]',
      '.js-profile-timeline-container',
      '.container-xl',
      '.container-lg',
      'body',
    ];

    for (const selector of potentialParents) {
      const parent = document.querySelector(selector);
      if (parent && document.contains(parent)) {
        return parent;
      }
    }

    return document.body; // Last resort
  }

  // Remove một element đã được tạo
  removeCreatedElement(element) {
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
      this.createdElements.delete(element);
    }
  }

  // Cleanup với placeholder handling và ordered restoration
  cleanup() {
    let restoredCount = 0;
    let removedCount = 0;

    // Sort by element depth (deeper elements first to avoid parent-child conflicts)
    const modificationEntries = Array.from(this.modifications.entries());
    modificationEntries.sort(([, modA], [, modB]) => {
      const depthA = this.getElementDepth(modA.element);
      const depthB = this.getElementDepth(modB.element);
      return depthB - depthA; // Deeper elements first
    });

    modificationEntries.forEach(([elementId, modification]) => {
      if (this.restoreModifiedElement(elementId)) {
        restoredCount++;
      }
    });

    // Remove created elements (now that modified elements are restored)
    const createdElementsArray = Array.from(this.createdElements);
    createdElementsArray.forEach((element) => {
      try {
        if (element && element.parentNode) {
          element.parentNode.removeChild(element);
          removedCount++;
        }
      } catch (error) {
        console.warn(
          '[MedievalTracker] Error removing created element:',
          error
        );
      }
    });

    // Clean up any remaining placeholders
    this.placeholders.forEach((placeholder, elementId) => {
      try {
        if (placeholder && placeholder.parentNode) {
          placeholder.remove();
        }
      } catch (error) {
        console.warn(
          `[MedievalTracker] Error removing placeholder for ${elementId}:`,
          error
        );
      }
    });

    // Enhanced fallback cleanup
    this.fallbackCleanup();

    // Clear all tracking data
    this.modifications.clear();
    this.createdElements.clear();
    this.placeholders.clear();
    this.originalStyles.clear();
    this.originalContent.clear();
    this.originalAttributes.clear();
  }

  // Get element depth in DOM tree
  getElementDepth(element) {
    let depth = 0;
    let current = element;
    while (current && current !== document.body) {
      depth++;
      current = current.parentNode;
    }
    return depth;
  }

  // Fallback cleanup với better GitHub element handling
  fallbackCleanup() {
    try {
      // 1. Handle remaining placeholders
      const placeholders = document.querySelectorAll(
        '[data-medieval-placeholder="true"]'
      );
      placeholders.forEach((placeholder) => {
        try {
          placeholder.remove();
        } catch (e) {
          console.warn('Error removing placeholder:', e);
        }
      });

      // 2. Find và restore GitHub elements bị trapped
      this.rescueTrappedGitHubElements();

      // 3. Clean up medieval elements
      const medievalElements = document.querySelectorAll(
        '[data-medieval-created], [data-medieval-modified]'
      );

      medievalElements.forEach((element) => {
        try {
          if (element.dataset.medievalCreated === 'true') {
            // Remove created elements
            if (element.parentNode) {
              element.parentNode.removeChild(element);
            }
          } else if (element.dataset.medievalModified === 'true') {
            // Try to restore modified elements
            this.attemptElementRestore(element);
          }
        } catch (error) {
          console.warn(
            '[MedievalTracker] Error in fallback cleanup for element:',
            error
          );
        }
      });

      // 4. Clean up medieval wrapper classes
      const medievalWrappers = [
        '.medieval-frame-wrapper',
        '.medieval-header-container',
        '.scrollable-map',
        '.castle-world',
        '.castle-container',
        '.medieval-flag',
        '.medieval-profile-container',
        '.medieval-avatar-container',
      ];

      medievalWrappers.forEach((className) => {
        document.querySelectorAll(className).forEach((wrapper) => {
          this.safelyRemoveWrapper(wrapper);
        });
      });
    } catch (error) {
      console.error(
        '[MedievalTracker] Error in enhanced fallback cleanup:',
        error
      );
    }
  }

  // Rescue GitHub elements that might be trapped in medieval wrappers
  rescueTrappedGitHubElements() {
    const gitHubElements = document.querySelectorAll(
      '.js-pinned-items-reorder-container, [data-testid="pinned-items"], .pinned-item-list-item'
    );

    gitHubElements.forEach((element) => {
      const medievalWrapper = element.closest(
        '.medieval-frame-wrapper, [class*="medieval"]'
      );

      if (medievalWrapper && medievalWrapper !== element) {
        // Find the best parent
        const bestParent = this.findBestParentForElement(element);
        if (bestParent) {
          bestParent.appendChild(element);
        }
      }
    });
  }

  // Safely remove wrapper while preserving important children
  safelyRemoveWrapper(wrapper) {
    try {
      // Look for important GitHub elements inside
      const importantElements = wrapper.querySelectorAll(
        '.js-pinned-items-reorder-container, [data-testid="pinned-items"], .pinned-item-list-item'
      );

      // Move important elements out before removing wrapper
      importantElements.forEach((element) => {
        const bestParent = this.findBestParentForElement(element);
        if (bestParent) {
          bestParent.appendChild(element);
        }
      });

      // Now safe to remove wrapper
      if (wrapper.parentNode) {
        wrapper.parentNode.removeChild(wrapper);
      }
    } catch (error) {
      console.warn('Error safely removing wrapper:', error);
    }
  }

  // Attempt to restore element from stored data
  attemptElementRestore(element) {
    try {
      // Try to restore from data attributes
      if (element.dataset.originalClass !== undefined) {
        element.className = element.dataset.originalClass;
      }
      if (element.dataset.originalStyle !== undefined) {
        element.style.cssText = element.dataset.originalStyle;
      }

      // Clean up medieval data attributes
      delete element.dataset.medievalCreated;
      delete element.dataset.medievalModified;
      delete element.dataset.medievalId;
      delete element.dataset.originalClass;
      delete element.dataset.originalStyle;
      delete element.dataset.originalContent;
    } catch (error) {
      console.warn('Error restoring element:', error);
    }
  }

  // Debug: hiển thị trạng thái tracking
  getTrackingStatus() {
    return {
      modificationsCount: this.modifications.size,
      createdElementsCount: this.createdElements.size,
      placeholdersCount: this.placeholders.size, // ✅ NEW
      modifications: Array.from(this.modifications.keys()),
      createdElements: Array.from(this.createdElements).map(
        (el) => el.tagName + '.' + el.className
      ),
      placeholders: Array.from(this.placeholders.keys()), // ✅ NEW
      modificationDetails: Array.from(this.modifications.entries()).map(
        ([id, mod]) => ({
          id,
          tagName: mod.element.tagName,
          className: mod.element.className,
          hasOriginalParent: !!mod.originalParent,
          hasPlaceholder: !!mod.placeholder, // ✅ NEW
          wasMoved: mod.wasMoved || false,
        })
      ),
    };
  }
}

// Singleton instance
export const medievalTracker = new MedievalTracker();

// Enhanced helper functions
export function trackCreated(element, identifier) {
  return medievalTracker.trackCreatedElement(element, identifier);
}

export function trackModified(element, originalData) {
  return medievalTracker.trackModifiedElement(element, originalData);
}

export function trackMoved(element, fromParent, toParent) {
  return medievalTracker.trackElementMove(element, fromParent, toParent);
}

export function cleanupMedieval() {
  medievalTracker.cleanup();
}
