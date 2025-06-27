import { trackModified, trackCreated } from './tracking.js';
import { getResourceUrl } from './utils.js';

/**
 * Main function to redesign GitHub profile section with medieval theme
 */
export function redesignProfileSection() {
  const layoutSideBar = document.querySelector('.Layout-sidebar');
  const profileContainer = document.querySelector(
    '.js-profile-editable-replace'
  );

  if (!layoutSideBar || !profileContainer) {
    return;
  }

  // Apply layout modifications
  applyLayoutStyles(layoutSideBar);

  // Redesign profile header section
  redesignProfileHeader(profileContainer);

  // Redesign organization section
  redesignOrganizationSection(profileContainer);

  styleUserProfileBio(profileContainer);
}

/**
 * Apply basic layout styles to sidebar
 */
function applyLayoutStyles(layoutSideBar) {
  // Track and modify main sidebar container
  trackModified(layoutSideBar, {
    style: layoutSideBar.style.cssText,
    className: layoutSideBar.className,
  });

  layoutSideBar.style.cssText = `margin: -10px; width: 350px;`;

  // Track and modify child element
  const childElement = layoutSideBar.childNodes[1];
  if (childElement?.style) {
    trackModified(childElement, { style: childElement.style.cssText });
    childElement.style.cssText = `margin-top: 0px !important;`;
  }
}

/**
 * Redesign the profile header with medieval frame and user info
 */
function redesignProfileHeader(profileContainer) {
  const targetElement = profileContainer.childNodes[1];
  if (!targetElement) {
    return;
  }

  // Extract and hide original name info
  const nameInfo = extractAndHideNameInfo();

  // Apply medieval frame background to profile
  applyProfileFrameStyles(targetElement);

  // Add redesigned name container
  if (nameInfo?.fullName || nameInfo?.username) {
    addNameContainer(targetElement, nameInfo);
  }

  // Style avatar with hover effects
  styleAvatarContainer(targetElement);
}

/**
 * Extract name information and hide original container
 */
function extractAndHideNameInfo() {
  const vcardContainer = document.querySelector('.vcard-names-container');
  if (!vcardContainer) return null;

  // Get computed styles BEFORE modification
  const computedStyle = window.getComputedStyle(vcardContainer);
  const originalInlineStyle = vcardContainer.style.cssText || '';

  // Extract name information BEFORE hiding
  const fullName = vcardContainer
    .querySelector('.vcard-fullname')
    ?.textContent?.trim();
  const username = vcardContainer
    .querySelector('.vcard-username')
    ?.textContent?.trim();

  const trackingData = {
    style: originalInlineStyle,
    className: vcardContainer.className,
    innerHTML: vcardContainer.innerHTML,
    // Only store what we actually need for restoration
    originalDisplay: computedStyle.display,
    originalVisibility: computedStyle.visibility,
    originalOpacity: computedStyle.opacity,
    wasVisible:
      computedStyle.display !== 'none' && computedStyle.visibility !== 'hidden',
  };

  trackModified(vcardContainer, trackingData);

  // Hide the container
  vcardContainer.style.display = 'none';
  vcardContainer.style.visibility = 'hidden';
  vcardContainer.dataset.medievalHidden = 'true';
  vcardContainer.dataset.wasVisible = trackingData.wasVisible
    ? 'true'
    : 'false';

  return { fullName: fullName || '', username: username || '' };
}

/**
 * Apply medieval frame background styles to profile element
 */
function applyProfileFrameStyles(targetElement) {
  const frameAvatarBackground = getResourceUrl('assets/icon/frame_avt.png');

  trackModified(targetElement, {
    style: targetElement.style.cssText,
    className: targetElement.className,
    innerHTML: targetElement.innerHTML,
  });

  targetElement.style.cssText = `
    background-image: url('${frameAvatarBackground}');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    position: relative;
    display: flex !important;
    flex-direction: column;
    justify-content: center;
    width: 360px;
    padding: 15px 100px 130px 70px;
    align-items: center;
  `;
}

/**
 * Create and add redesigned name container
 */
function addNameContainer(targetElement, nameInfo) {
  const nameContainer = document.createElement('div');
  nameContainer.className = 'redesigned-name-container';
  nameContainer.style.cssText = `
    margin-bottom: ${nameInfo.fullName ? '10px' : '40px'};
    text-align: center;
    width: 100%;
    max-width: 280px;
  `;

  trackCreated(nameContainer, 'redesigned-name-container');

  // Add full name if available
  if (nameInfo.fullName) {
    const fullNameElement = createStyledElement(
      'h1',
      nameInfo.fullName,
      `
      font-size: 1.5rem;
      font-weight: 600;
      color: #F1C488;
      margin: 0 0 8px 0;
      line-height: 1.3;
      font-family: "Unlock", serif;
      padding-bottom: 10px;
      border-bottom: 2px solid #E7BA77;
    `
    );
    trackCreated(fullNameElement, 'redesigned-fullname');
    nameContainer.appendChild(fullNameElement);
  }

  // Add username if available
  if (nameInfo.username) {
    const usernameElement = createStyledElement(
      'p',
      nameInfo.username,
      `
      font-size: 1rem;
      font-weight: 400;
      color: #ffffff;
      margin: 0;
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
    `
    );
    trackCreated(usernameElement, 'redesigned-username');
    nameContainer.appendChild(usernameElement);
  }

  targetElement.insertBefore(nameContainer, targetElement.firstChild);
}

/**
 * Create a styled element with text content
 */
function createStyledElement(tag, textContent, styles) {
  const element = document.createElement(tag);
  element.textContent = textContent;
  element.style.cssText = styles;
  return element;
}

/**
 * Style avatar container with hover effects
 */
function styleAvatarContainer(targetElement) {
  const avatarContainer = targetElement.querySelector('.position-relative');
  if (!avatarContainer) return;

  trackModified(avatarContainer, { style: avatarContainer.style.cssText });
  avatarContainer.style.cssText = `
    z-index: 4;
    transition: transform 0.3s ease;
    width: 150px;
  `;

  const avatarImg = avatarContainer.querySelector('.avatar');
  if (!avatarImg) return;

  // Store original event listeners
  const originalMouseEnter = avatarImg.onmouseenter;
  const originalMouseLeave = avatarImg.onmouseleave;

  trackModified(avatarImg, { style: avatarImg.style.cssText });
  avatarImg.dataset.originalMouseEnter = originalMouseEnter ? 'true' : 'false';
  avatarImg.dataset.originalMouseLeave = originalMouseLeave ? 'true' : 'false';

  // Apply avatar styles
  avatarImg.style.cssText = `
    height: auto;
    border: 4px solid rgba(255, 255, 255, 0.8);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
  `;

  // Add hover effects
  avatarImg.addEventListener('mouseenter', function () {
    this.style.transform = 'scale(1.05)';
    this.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.2)';
  });

  avatarImg.addEventListener('mouseleave', function () {
    this.style.transform = 'scale(1)';
    this.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
  });
}

/**
 * Redesign organization section with medieval shields
 */
function redesignOrganizationSection(profileContainer) {
  const checkLength = profileContainer.children.length;

  // Determine target element based on container length
  const targetElement = getOrganizationTargetElement(
    profileContainer,
    checkLength
  );
  if (!targetElement) {
    return;
  }

  // Get organization data
  const h2Element = targetElement.querySelector('h2');
  const aElements = targetElement.querySelectorAll('a[aria-label]');

  if (aElements.length <= 0) {
    return;
  }

  // Apply organization frame styles
  applyOrganizationFrameStyles(targetElement, aElements.length);

  // Create and populate organization containers
  const { headerContainer, avatarOrgContainer } =
    createOrganizationContainers(h2Element);

  // Style organization avatars
  styleOrganizationAvatars(aElements, avatarOrgContainer);

  // Replace content with new containers
  targetElement.innerHTML = '';
  targetElement.appendChild(headerContainer);
  targetElement.appendChild(avatarOrgContainer);
}

/**
 * Get the appropriate target element for organization section
 */
function getOrganizationTargetElement(profileContainer, checkLength) {
  switch (checkLength) {
    case 7:
      return profileContainer.childNodes.item(7).nextSibling;
    case 9:
      return profileContainer.childNodes.item(11).nextSibling;
    default:
      return profileContainer.lastElementChild;
  }
}

/**
 * Apply medieval frame styles to organization section
 */
function applyOrganizationFrameStyles(targetElement, orgCount) {
  const frameOrgBackground = getResourceUrl('assets/icon/frame_org.png');

  trackModified(targetElement, {
    style: targetElement.style.cssText,
    className: targetElement.className,
    innerHTML: targetElement.innerHTML,
  });

  targetElement.classList.remove('border-top', 'color-border-muted', 'mt-3');

  // Adjust height and padding based on organization count
  const isSmallGroup = orgCount <= 3;
  const height = isSmallGroup ? '300px' : '355px';
  const backgroundSize = isSmallGroup ? '100% 90%' : '100% 95%';

  targetElement.style.cssText = `
    background-image: url('${frameOrgBackground}');
    background-size: ${backgroundSize};
    background-position: center;
    background-repeat: no-repeat;
    position: relative;
    height: ${height};
    display: flex;
    flex-direction: column;
    align-items: center;
  `;
}

/**
 * Create header and avatar containers for organizations
 */
function createOrganizationContainers(h2Element) {
  // Create header container
  const headerContainer = document.createElement('div');
  headerContainer.style.cssText = `
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 105px;
  `;
  trackCreated(headerContainer, 'org-header-container');

  // Style and add h2 element
  if (h2Element) {
    trackModified(h2Element, { style: h2Element.style.cssText });
    h2Element.style.cssText = `
      margin: 0;
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      color: #24292f;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
      font-family: 'Cinzel', 'Times New Roman', serif;
    `;
    headerContainer.appendChild(h2Element);
  }

  // Create avatar container
  const avatarOrgContainer = document.createElement('div');
  avatarOrgContainer.style.cssText = `
    display: grid;
    grid-template-columns: repeat(3, 0fr);
    gap: 5px;
    max-width: 350px;
    justify-items: center;
    align-items: center;
    padding: 0 20px;
  `;
  trackCreated(avatarOrgContainer, 'avatar-org-container');

  return { headerContainer, avatarOrgContainer };
}

/**
 * Style organization avatars with medieval shields
 */
function styleOrganizationAvatars(aElements, avatarOrgContainer) {
  // Add medieval shield styles
  addMedievalShieldStyles(aElements.length <= 3);

  // Process each organization element (limit to 6)
  aElements.forEach((aElement, index) => {
    if (index >= 6) return; // Limit to 6 organizations

    trackModified(aElement, {
      style: aElement.style.cssText,
      parentNode: aElement.parentNode,
      nextSibling: aElement.nextSibling,
    });

    // Create shield wrapper structure
    const shieldWrapper = createShieldWrapper(index);
    const shieldInner = createShieldInner(index);

    // Style the organization link
    styleOrganizationLink(aElement, aElements.length <= 3);

    // Assemble shield structure
    shieldInner.appendChild(aElement);
    shieldWrapper.appendChild(shieldInner);
    shieldWrapper.appendChild(createEmblem(index));

    avatarOrgContainer.appendChild(shieldWrapper);
  });

  // Adjust grid layout for smaller groups
  if (aElements.length <= 3) {
    avatarOrgContainer.style.gridTemplateColumns = `repeat(${aElements.length}, 1fr)`;
  } else if (aElements.length <= 4) {
    avatarOrgContainer.style.gridTemplateColumns = 'repeat(3, 0fr)';
    avatarOrgContainer.style.gridTemplateRows = 'repeat(3, 0fr)';
  }
}

/**
 * Add CSS styles for medieval shields
 */
function addMedievalShieldStyles(isSmallGroup) {
  const shieldImageUrl = getResourceUrl('assets/icon/listOrg.png');
  const shieldSize = isSmallGroup
    ? { width: '80px', height: '70px' }
    : { width: '70px', height: '60px' };

  const shieldStyles = `
    .medieval-shield {
      position: relative;
      width: ${shieldSize.width};
      height: ${shieldSize.height};
      background-image: url('${shieldImageUrl}');
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .medieval-shield:hover {
      transform: scale(1.1);
      filter: brightness(1.2) drop-shadow(0 0 15px rgba(255,215,0,0.8));
    }
  `;

  const styleSheet = document.createElement('style');
  styleSheet.textContent = shieldStyles;
  document.head.appendChild(styleSheet);
  trackCreated(styleSheet, 'medieval-shield-styles');
}

/**
 * Create shield wrapper element
 */
function createShieldWrapper(index) {
  const shieldWrapper = document.createElement('div');
  shieldWrapper.className = 'medieval-shield';
  trackCreated(shieldWrapper, `shield-wrapper-${index}`);
  return shieldWrapper;
}

/**
 * Create shield inner container
 */
function createShieldInner(index) {
  const shieldInner = document.createElement('div');
  shieldInner.className = 'medieval-shield-inner';
  trackCreated(shieldInner, `shield-inner-${index}`);
  return shieldInner;
}

/**
 * Create shield emblem element
 */
function createEmblem(index) {
  const emblem = document.createElement('div');
  emblem.className = 'medieval-emblem';
  trackCreated(emblem, `shield-emblem-${index}`);
  return emblem;
}

/**
 * Style organization link and its avatar image
 */
function styleOrganizationLink(aElement, isSmallGroup) {
  const avatarSize = isSmallGroup
    ? { width: '42px', height: '42px' }
    : { width: '30px', height: '30px' };

  aElement.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    overflow: hidden;
    position: relative;
    margin: 6px 0px 5px -5px;
  `;

  const imgElement = aElement.querySelector('img');
  if (imgElement) {
    trackModified(imgElement, { style: imgElement.style.cssText });
    imgElement.style.cssText = `
      width: ${avatarSize.width};
      height: ${avatarSize.height};
      border-radius: 50%;
      border: 2px solid #ffffff;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    `;
  }
}

function styleUserProfileBio(profileContainer) {
  const bioText = document.querySelector('.user-profile-bio');
  const userBadgeContainer = document.querySelector(
    '.user-status-circle-badge-container'
  );
  const userBadge = document.querySelector('.user-status-circle-badge');

  if (profileContainer && bioText) {
    profileContainer.style.cssText = `position: relative;`;
    bioText.style.cssText = `  
      position: absolute;
      top: 255px;
      left: 125px;
      overflow: hidden;
      font-size: 14px;
      color: #713535;
      font-family: "Unkempt", cursive;
    `;
  }

  if (userBadgeContainer && userBadge) {
    userBadgeContainer.style.cssText = 'margin-bottom: 0;';
  }
}

function restoreVcardContainer() {
  const vcardContainer = document.querySelector(
    '.vcard-names-container[data-medieval-hidden="true"]'
  );
  if (!vcardContainer) {
    return false;
  }

  try {
    const medievalId = vcardContainer.dataset.medievalId;
    if (!medievalId) {
      return false;
    }

    const restored = medievalTracker.restoreModifiedElement(medievalId);

    if (restored) {
      return true;
    }

    // Clear problematic styles
    vcardContainer.style.display = '';
    vcardContainer.style.visibility = '';
    vcardContainer.style.opacity = '';

    // Check if it was originally visible
    const wasVisible = vcardContainer.dataset.wasVisible === 'true';
    if (wasVisible) {
      // Force show if it was originally visible
      vcardContainer.style.display = 'block';
      vcardContainer.style.visibility = 'visible';
    }

    // Clean up medieval markers
    delete vcardContainer.dataset.medievalHidden;
    delete vcardContainer.dataset.wasVisible;
    delete vcardContainer.dataset.medievalId;
    delete vcardContainer.dataset.medievalModified;

    // Force reflow
    vcardContainer.offsetHeight;

    // Verify restoration
    const finalStyle = window.getComputedStyle(vcardContainer);
    const isVisible =
      finalStyle.display !== 'none' && finalStyle.visibility !== 'hidden';

    return isVisible;
  } catch (error) {
    console.error('[ProfileSection] Error restoring vCard container:', error);
    return false;
  }
}

export function restoreProfileSection() {
  const vcardRestored = restoreVcardContainer();
  if (!vcardRestored) {
    console.warn('[ProfileSection] Failed to restore vCard container');
  }

  const redesignedNameContainers = document.querySelectorAll(
    '.redesigned-name-container'
  );
  redesignedNameContainers.forEach((container) => {
    try {
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    } catch (error) {
      console.warn(
        '[ProfileSection] Error removing redesigned name container:',
        error
      );
    }
  });

  return vcardRestored;
}
