import { setupDragScroll } from './dragScroll.js';
import { createFlag, createCastleImage } from './flag.js';
import { CASTLE_POSITIONS } from './constants.js';
import { trackCreated, trackModified } from './tracking.js';
import { getResourceUrl } from './utils.js';

// Hàm redesign pinned repositories section
export function redesignPinnedRepos() {
  const pinnedContainer = document.querySelector(
    '.js-pinned-items-reorder-container'
  );

  const hasPinnedContent = pinnedContainer
    ?.querySelector('h2')
    ?.textContent.trim()
    ?.includes('Pinned');

  if (pinnedContainer) {
    // ✅ FIX 1: Lưu reference đến parent container để đảm bảo không bị mất
    const originalParent = pinnedContainer.parentNode;
    const originalNextSibling = pinnedContainer.nextSibling;

    // Tạo một placeholder để đánh dấu vị trí ban đầu
    const placeholder = document.createElement('div');
    placeholder.style.display = 'none';
    placeholder.dataset.medievalPlaceholder = 'true';
    placeholder.dataset.placeholderFor = 'pinned-container';

    // Insert placeholder vào vị trí ban đầu
    originalParent.insertBefore(placeholder, pinnedContainer);

    // ✅ FIX 2: Enhanced tracking với placeholder reference
    trackModified(pinnedContainer, {
      originalParent: originalParent,
      originalNextSibling: originalNextSibling,
      placeholder: placeholder, // Thêm placeholder reference
      className: pinnedContainer.className,
      style: pinnedContainer.style.cssText,
      innerHTML: pinnedContainer.innerHTML,
    });

    const medievalMapBackground = getResourceUrl(
      'assets/icon/background_map.png'
    );
    const customFrameUrl = getResourceUrl('assets/icon/frame_map.png');

    // Tạo container wrapper cho toàn bộ phần tử
    const frameWrapper = document.createElement('div');
    trackCreated(frameWrapper, 'pinnedRepos_frameWrapper');

    frameWrapper.className = 'medieval-frame-wrapper';
    frameWrapper.style.cssText = `
        position: relative;
        width: 922px;
        height: 685px;
        background-image: url('${customFrameUrl}');
        background-size: 90% 98%;
        background-repeat: no-repeat;
        background-position: center;
        padding: ${hasPinnedContent ? 0 : '120px 98px 137px 123px'};
        box-sizing: border-box;
      `;

    originalParent.insertBefore(frameWrapper, placeholder);

    // Di chuyển pinnedContainer vào frameWrapper
    frameWrapper.appendChild(pinnedContainer);

    // Tách header ra khỏi pinned container
    const header = pinnedContainer.querySelector('h2');
    let headerContainer = null;

    if (header) {
      const originalParentH2 = header.parentNode;
      const originalNextSiblingH2 = header.nextSibling;

      // Tạo một placeholder để đánh dấu vị trí ban đầu
      const placeholderH2 = document.createElement('div');
      placeholderH2.style.display = 'none';
      placeholderH2.dataset.medievalH2Placeholder = 'true';
      placeholderH2.dataset.placeholderFor = 'h2';

      // Insert placeholder vào vị trí ban đầu
      originalParentH2.insertBefore(placeholderH2, header);
      // Track modification của header
      trackModified(header, {
        originalParent: originalParentH2,
        originalNextSibling: originalNextSiblingH2,
        placeholder: placeholderH2, // Thêm placeholder reference
        className: header.className,
        style: header.style.cssText,
        innerHTML: header.innerHTML,
      });

      // Tạo container riêng cho header
      headerContainer = document.createElement('div');
      trackCreated(headerContainer, 'pinnedRepos_headerContainer');

      headerContainer.className = 'medieval-header-container';
      headerContainer.style.cssText = `
          position: absolute;
          top: 87px;
          left: 52%;
          transform: translateX(-50%);
          z-index: 20;
          width: 90%;
          text-align: center;
        `;

      // Style cho header
      header.style.cssText = `
          color: #ffffff;
        `;

      // Xóa decorative border cũ nếu có
      const existingBorder = header.querySelector('div');
      if (existingBorder) {
        existingBorder.remove();
      }

      headerContainer.appendChild(header);
      frameWrapper.appendChild(headerContainer);
    }

    // Style cho map container
    pinnedContainer.style.cssText = `
        background-image: url('${medievalMapBackground}');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        position: relative;
        overflow: hidden;
        width: 100%;
        height: 100%;
        cursor: grab;
        user-select: none;
        border-radius: 40px;
        margin: 0;
      `;

    // Tạo scrollable content area
    const scrollableArea = document.createElement('div');
    trackCreated(scrollableArea, 'pinnedRepos_scrollableArea');

    scrollableArea.className = 'scrollable-map';
    scrollableArea.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 900px;
        height: 600px;
        background-image: url('${medievalMapBackground}');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
      `;

    // Thêm overlay
    const overlay = document.createElement('div');
    trackCreated(overlay, 'pinnedRepos_overlay');

    overlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: 
          radial-gradient(circle at 20% 30%, rgba(101, 67, 33, 0.2) 0%, transparent 40%),
          radial-gradient(circle at 80% 70%, rgba(139, 105, 20, 0.15) 0%, transparent 40%);
        pointer-events: none;
        z-index: 1;
      `;
    scrollableArea.appendChild(overlay);

    // Tạo container cho các castle
    const castleContainer = document.createElement('div');
    trackCreated(castleContainer, 'pinnedRepos_castleContainer');

    castleContainer.className = 'castle-world';
    castleContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2;
      `;

    // Style và biến đổi repository list
    const repoList = pinnedContainer.querySelector('.d-flex.flex-wrap');
    if (repoList) {
      // Track modification của repo list
      trackModified(repoList, {
        originalParent: repoList.parentNode,
        originalNextSibling: repoList.nextSibling,
        className: repoList.className,
        style: repoList.style.cssText,
        innerHTML: repoList.innerHTML,
      });

      // Biến đổi các repository items thành castle
      const repoItems = repoList.querySelectorAll('.pinned-item-list-item');
      repoItems.forEach((item, index) => {
        // Track modification của từng repo item
        trackModified(item, {
          className: item.className,
          style: item.style.cssText,
        });

        if (index >= CASTLE_POSITIONS.length) return;

        const castleElement = document.createElement('div');
        trackCreated(castleElement, `pinnedRepos_castle_${index}`);

        castleElement.className = 'castle-container';
        castleElement.style.cssText = `
            position: absolute;
            left: ${CASTLE_POSITIONS[index].x}%;
            top: ${CASTLE_POSITIONS[index].y}%;
            transform: translate(-50%, -50%);
            width: 100px;
            height: 120px;
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 10;
          `;

        // Tạo castle image
        const castleImg = createCastleImage();
        castleImg.style.cssText = `
            width: ${index === 2 ? '170px' : '120px'};
            height: ${index === 2 ? '170px' : '120px'};
          `;

        // Lấy thông tin từ item gốc
        const repoLink = item.querySelector('.Link.text-bold');
        const description = item.querySelector('.pinned-item-desc');
        const language = item.querySelector('[itemprop="programmingLanguage"]');
        const stars = item.querySelector('a[href*="/stargazers"]');
        const forks = item.querySelector('a[href*="/forks"]');

        const repoName = repoLink ? repoLink.textContent.trim() : 'Unknown';
        const repoDesc = description ? description.textContent.trim() : '';
        const repoLang = language ? language.textContent.trim() : '';
        const starsCount = stars ? stars.textContent.trim() : '0';
        const forksCount = forks ? forks.textContent.trim() : '0';
        const repoUrl = repoLink ? repoLink.href : '#';

        // Tạo lá cờ
        const flag = createFlag(
          index,
          repoName,
          repoDesc,
          repoLang,
          starsCount,
          forksCount
        );

        flag.style.cssText = `
            position: absolute;
            top: ${index === 2 ? '-50px' : '-60px'};
            left: ${index === 2 ? '75%' : '50%'};
            transform: translateX(-50%) scale(1);
            z-index: 15;
            pointer-events: none;
          `;

        // Enhanced hover effects
        castleElement.addEventListener('mouseenter', () => {
          castleElement.style.transform = 'translate(-50%, -50%) scale(1.15)';
          castleImg.style.filter =
            'drop-shadow(0 6px 12px rgba(0,0,0,0.4)) brightness(1.2)';
          flag.style.transform = 'translateX(-50%) scale(1.1)';
          const flagEl = flag.querySelector('.medieval-flag');
          const flagTitle = flag.querySelector('.flag-title');
          if (flagEl) {
            flagEl.style.animationDuration = '1.5s';
            flagEl.style.filter = 'brightness(1.2)';
            flagEl.style.width = '150px';
            flagTitle.style.overflow = 'visible';
          }
        });

        castleElement.addEventListener('mouseleave', () => {
          castleElement.style.transform = 'translate(-50%, -50%) scale(1)';
          castleImg.style.filter = 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))';
          flag.style.transform = 'translateX(-50%) scale(1)';
          const flagEl = flag.querySelector('.medieval-flag');
          const flagTitle = flag.querySelector('.flag-title');
          if (flagEl) {
            flagEl.style.animationDuration = '3s';
            flagEl.style.filter = 'brightness(1)';
            flagEl.style.width = '100px';
            flagTitle.style.overflow = 'hidden';
          }
        });

        // Click để mở repository
        castleElement.addEventListener('click', (e) => {
          e.stopPropagation();
          if (repoUrl !== '#') {
            window.location.href = repoUrl;
          }
        });

        // Thêm các phần tử vào castle
        castleElement.appendChild(castleImg);
        castleElement.appendChild(flag);
        castleContainer.appendChild(castleElement);
      });

      // Ẩn repository list gốc
      repoList.style.display = 'none';
    }

    // Thêm scrollable area và castle container
    scrollableArea.appendChild(castleContainer);
    pinnedContainer.appendChild(scrollableArea);

    // Setup drag scroll
    setupDragScroll(pinnedContainer, scrollableArea);
  } else {
    console.log('Pinned container not found yet, retrying...');
  }
}
