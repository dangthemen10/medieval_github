import { trackModified, trackCreated } from './tracking.js';

/**
 * Main function to redesign GitHub profile section with medieval theme
 */
export function redesignProfileSection() {
  const layoutSideBar = document.querySelector('.Layout-sidebar');
  const profileContainer = document.querySelector(
    '.js-profile-editable-replace'
  );

  if (!layoutSideBar || !profileContainer) {
    console.warn('Required containers not found');
    return;
  }

  // Apply layout modifications
  applyLayoutStyles(layoutSideBar);

  // Redesign profile header section
  redesignProfileHeader(profileContainer);

  // Redesign organization section
  redesignOrganizationSection(profileContainer);

  console.log('GitHub profile section redesigned successfully');
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
    console.warn('Target element not found');
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

  // Store original state for restoration
  const computedStyle = window.getComputedStyle(vcardContainer);
  trackModified(vcardContainer, {
    style: vcardContainer.style.cssText,
    className: vcardContainer.className,
    innerHTML: vcardContainer.innerHTML,
    computedDisplay: computedStyle.display,
    computedVisibility: computedStyle.visibility,
    computedOpacity: computedStyle.opacity,
    inlineDisplay: vcardContainer.style.display || '',
    inlineVisibility: vcardContainer.style.visibility || '',
    inlineOpacity: vcardContainer.style.opacity || '',
    wasOriginallyVisible:
      computedStyle.display !== 'none' && computedStyle.visibility !== 'hidden',
    originalComputedDisplay: computedStyle.display,
  });

  // Extract name information
  const fullName = vcardContainer
    .querySelector('.vcard-fullname')
    ?.textContent?.trim();
  const username = vcardContainer
    .querySelector('.vcard-username')
    ?.textContent?.trim();

  // Hide original container
  vcardContainer.style.display = 'none';
  vcardContainer.style.visibility = 'hidden';
  vcardContainer.dataset.medievalHidden = 'true';
  vcardContainer.dataset.medievalOriginalDisplay = computedStyle.display;

  return { fullName: fullName || '', username: username || '' };
}

/**
 * Apply medieval frame background styles to profile element
 */
function applyProfileFrameStyles(targetElement) {
  const frameAvatarBackground = chrome.runtime.getURL('icon/frame_avt.png');

  trackModified(targetElement, {
    style: targetElement.style.cssText,
    className: targetElement.className,
    innerHTML: targetElement.innerHTML,
  });

  targetElement.style.cssText = `
    background-image: url('${frameAvatarBackground}');
    background-size: 150% 100%;
    background-position: center;
    background-repeat: no-repeat;
    position: relative;
    width: 360px;
    height: 498px;
    padding: 32px 113px 60px 78px;
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
      color: #24292f;
      margin: 0 0 8px 0;
      line-height: 1.3;
    `
    );
    trackCreated(fullNameElement, 'redesigned-fullname');
    nameContainer.appendChild(fullNameElement);
  }

  // Add separator if both name and username exist
  if (nameInfo.fullName && nameInfo.username) {
    const separator = createSeparator();
    trackCreated(separator, 'redesigned-separator');
    nameContainer.appendChild(separator);
  }

  // Add username if available
  if (nameInfo.username) {
    const usernameElement = createStyledElement(
      'p',
      nameInfo.username,
      `
      font-size: 1.1rem;
      font-weight: 400;
      color: #656d76;
      margin: 0;
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
    `
    );
    trackCreated(usernameElement, 'redesigned-username');
    nameContainer.appendChild(usernameElement);
  }

  // Add separator for username-only case
  if (!nameInfo.fullName) {
    const separator = createSeparator();
    trackCreated(separator, 'redesigned-separator-alt');
    nameContainer.appendChild(separator);
  }

  targetElement.insertBefore(nameContainer, targetElement.firstChild);
}

/**
 * Create a styled separator element
 */
function createSeparator() {
  const separator = document.createElement('hr');
  separator.style.cssText = `
    border: none;
    height: 1px;
    background: linear-gradient(90deg, transparent, #d0d7de, transparent);
    margin: 10px 0;
  `;
  return separator;
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
  console.log('checkLengthProfileContainer', checkLength);

  // Determine target element based on container length
  const targetElement = getOrganizationTargetElement(
    profileContainer,
    checkLength
  );
  if (!targetElement) {
    console.warn('Organization target element not found');
    return;
  }

  // Get organization data
  const h2Element = targetElement.querySelector('h2');
  const aElements = targetElement.querySelectorAll('a[aria-label]');

  if (aElements.length <= 0) {
    console.warn('No organization elements found');
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
  const frameOrgBackground = chrome.runtime.getURL('icon/frame_org.png');

  trackModified(targetElement, {
    style: targetElement.style.cssText,
    className: targetElement.className,
    innerHTML: targetElement.innerHTML,
  });

  targetElement.classList.remove('border-top', 'color-border-muted', 'mt-3');

  // Adjust height and padding based on organization count
  const isSmallGroup = orgCount <= 3;
  const height = isSmallGroup ? '300px' : '355px';
  const paddingTop = isSmallGroup ? '90px' : '105px';
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
  const shieldImageUrl = chrome.runtime.getURL('icon/listOrg.png');
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
